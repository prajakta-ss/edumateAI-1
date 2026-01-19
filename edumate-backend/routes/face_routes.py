from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import numpy as np
import jwt
from datetime import datetime, timedelta

from utils.face_utils import get_face_embedding  

face_bp = Blueprint("face", __name__)

# ===================== REGISTER =====================
@face_bp.route("/register", methods=["POST"])
@cross_origin()
def face_register():
    data = request.json or {}
    email = data.get("email")
    image = data.get("image")

    print("Image received:", image[:30] if image else "NO IMAGE")

    if not email or not image:
        return jsonify({"message": "Email and image required"}), 400

    embedding = get_face_embedding(image)
    if embedding is None:
        return jsonify({"message": "No face detected"}), 400

    users = current_app.mongo.db.users
    users.update_one(
        {"email": email},
        {"$set": {"face_embedding": embedding.tolist()}}
    )

    return jsonify({"message": "Face registered successfully"}), 200


# ===================== LOGIN =====================
@face_bp.route("/login", methods=["POST"])
@cross_origin()
def face_login():
    image = request.json.get("image")

    embedding = get_face_embedding(image)
    if embedding is None:
        return jsonify({"message": "No face detected"}), 400

    users = current_app.mongo.db.users

    for user in users.find({"face_embedding": {"$exists": True}}):
        stored = np.array(user["face_embedding"])

        #  Euclidean distance (MediaPipe way)
        distance = np.linalg.norm(stored - embedding)

        if distance < 0.9:  # threshold
            token = jwt.encode(
                {
                    "email": user["email"],
                    "exp": datetime.utcnow() + timedelta(hours=1)
                },
                current_app.config["SECRET_KEY"],
                algorithm="HS256"
            )

            return jsonify({
                "token": token,
                "user": {
                    "email": user["email"],
                    "name": user["name"]
                }
            }), 200

    return jsonify({"message": "Face not recognized"}), 401
