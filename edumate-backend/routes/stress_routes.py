from datetime import datetime

from bson import ObjectId
from flask import Blueprint, current_app, request, jsonify
import pickle
import numpy as np

stress_bp = Blueprint("stress", __name__)

# Load model
model = pickle.load(open("models/stress_model.pkl", "rb"))
le = pickle.load(open("models/label_encoder.pkl", "rb"))

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
    try:
        #ML PREDICTION 
     features = np.array(answers).reshape(1, -1)

     prediction = model.predict(features)
     stress_level = le.inverse_transform(prediction)[0].lower()
      # Save to MongoDB
     mongo = current_app.mongo
     record = {
            "student_id": ObjectId(student_id),
            "timestamp": datetime.utcnow(),
            "stress_level": stress_level
        }

    
     result = mongo.db.stressRecord.insert_one(record)
     return jsonify({
            "stress_level": stress_level,
            "record_id": str(result.inserted_id)
        })
    except Exception as e:
     print(" ERROR:", str(e))
     return jsonify({"error": str(e)}), 500