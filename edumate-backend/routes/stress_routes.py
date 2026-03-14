from flask import Blueprint, request, jsonify
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

    if not answers:
        return jsonify({"error": "No answers provided"}), 400

    if len(answers) != 20:
        return jsonify({"error": "20 answers required"}), 400

    features = np.array(answers).reshape(1, -1)

    prediction = model.predict(features)
    stress_level = le.inverse_transform(prediction)[0]

    return jsonify({"stress_level": stress_level})