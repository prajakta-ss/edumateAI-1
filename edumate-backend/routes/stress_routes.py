from datetime import datetime

from bson import ObjectId
from click import prompt
from flask import Blueprint, current_app, request, jsonify
import pickle
import numpy as np
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

stress_bp = Blueprint("stress", __name__)

# Load model
model = pickle.load(open("models/stress_model.pkl", "rb"))
le = pickle.load(open("models/label_encoder.pkl", "rb"))

# Initialize OpenAI client

#print("DEBUG API KEY:", os.getenv("OPENAI_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@stress_bp.route("/predict", methods=["POST"])
def predict_stress():

    data = request.json
    answers = data.get("answers")
    student_id = data.get("student_id")

    if not answers:
        return jsonify({"error": "No answers provided"}), 400

    if len(answers) != 20:
        return jsonify({"error": "20 answers required"}), 400
    
    if not student_id:
        return jsonify({"error": "student_id required"}), 400
    if not ObjectId.is_valid(student_id):
        return jsonify({"error": "Invalid student_id"}), 400
    try:
        # ML PREDICTION 
        features = np.array(answers).reshape(1, -1)
        prediction = model.predict(features)
        stress_level = le.inverse_transform(prediction)[0].lower()
        
        # Detect factors (rule-based)
        factors = []

        if answers[0] >= 4:
            factors.append("academic workload")

        if answers[1] >= 4:
            factors.append("lack of concentration")

        if answers[2] >= 4:
            factors.append("exam anxiety")

        if answers[5] >= 4:
            factors.append("poor time management")

        if answers[8] == 1:
            factors.append("sleep issues")

        if answers[13] == 1:
            factors.append("irritability")

        if answers[15] <= 2:
            factors.append("low confidence")

        if answers[16] <= 2:
            factors.append("lack of support")

        if answers[17] <= 2:
            factors.append("difficulty managing stress")

        # fallback
        if not factors:
            factors.append("general academic pressure")
         #  AI Analysis
        prompt = f"""
        A student has a stress level of {stress_level}.
        The main factors affecting them are: {', '.join(factors)}.

        Write a clear, supportive, and personalized paragraph explaining:
        - why the student might be stressed
        - what these factors mean
        - practical suggestions to improve

        Keep it simple and student-friendly.
        """
        #  AI Analysis with fallback
        try:
            ai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
            )

            analysis = ai_response.choices[0].message.content

        except Exception as ai_error:
         print("AI Error:", str(ai_error))

        #  Fallback (NO API required)
        if stress_level == "low":
          analysis = """
    Your stress level is low, which indicates that you are generally managing your academic and personal life well.
    While there may be occasional challenges, such as minor issues with sleep or focus, they are not significantly
    impacting your overall well-being. Continue maintaining a balanced routine, stay consistent with your habits,
    and seek support whenever needed to keep your stress levels under control.
    """
        elif stress_level == "medium":
         analysis = f"""
    Your stress level is moderate. Factors such as {', '.join(factors)} may be contributing to your stress.
    These suggest that certain areas of your academic or personal life need attention. Improving time management,
    maintaining a regular sleep schedule, and taking short breaks during study sessions can help reduce stress.
    """

        else:  # high
          analysis = f"""
    Your stress level is high. It appears to be strongly influenced by {', '.join(factors)}.
    These factors indicate significant pressure in your academic or personal life. It is important to take
    immediate steps such as organizing your workload, improving sleep habits, and seeking support from
    friends, family, or mentors. Practicing relaxation techniques can also help manage stress effectively.
    """
        
        # Save to MongoDB
        mongo = current_app.mongo
        record = {
            "student_id": ObjectId(student_id),
            "timestamp": datetime.utcnow(),
            "stress_level": stress_level,
            "analysis": analysis  
        }
        
        result = mongo.db.stressRecord.insert_one(record)
        
        return jsonify({
            "stress_level": stress_level,
            "analysis": analysis,
            "record_id": str(result.inserted_id)
        })
    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500