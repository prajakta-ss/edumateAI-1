from flask import Blueprint, request, jsonify
from middlewares.auth_middleware import token_required
from extensions import mongo
from datetime import datetime
from bson import ObjectId
import pickle
import pandas as pd

performance_bp = Blueprint("performance", __name__)

# -----------------------------
# SUBJECTS (FIXED ORDER)
# -----------------------------
EXPECTED_SUBJECTS = [
    'Systems in mechanical engg',
    'Basic electrical engg',
    'Engineering  Physics',
    'Programming & Problem solving',
    'Engg Mathematics - I',
    'Engineering  Mechanics',
    'Basic electronics engineering ',
    'Engg Chemistry',
    'Engg Graphics',
    'Engg Mathematics II',
    'Fundamentals of Programming Languages\n(For 2024 Pattern only!)'
]

# -----------------------------
# SUBJECT CATEGORIES
# -----------------------------
THEORY_SUBJECTS = [
    'Engineering  Physics',
    'Engg Chemistry',
    'Systems in mechanical engg',
    'Basic electronics engineering '
]

COMPUTATIONAL_SUBJECTS = [
    'Engg Mathematics - I',
    'Engg Mathematics II',
    'Programming & Problem solving',
    'Fundamentals of Programming Languages\n(For 2024 Pattern only!)',
    'Engineering  Mechanics'
]

# -----------------------------
# GRADE MAPPING
# -----------------------------
grade_map = {
    "O": 10, "A+": 9, "A": 8, "B+": 7,
    "B": 6, "C": 5, "D": 4, "P": 2, "F": 0
}

# -----------------------------
# LOAD MODEL
# -----------------------------
try:
    model = pickle.load(open("D:\\Edumate AI\\edumate-backend\\models\\model.pkl", "rb"))
    le = pickle.load(open("D:\\Edumate AI\\edumate-backend\\models\\le.pkl", "rb"))
    model_available = True
except Exception as e:
    print("Model load error:", str(e))
    model_available = False


# =====================================================
# SAVE MARKS + ANALYSIS
# =====================================================
@performance_bp.route("/marks", methods=["POST"])
@token_required
def save_marks():
    try:
        data = request.json or {}
        student_id = ObjectId(request.user["user_id"])

        marks_data = data.get("marks", [])

        if not marks_data:
            return jsonify({"message": "No marks data provided"}), 400

        subject_dict = {}

        # -----------------------------
        # VALIDATION
        # -----------------------------
        for mark in marks_data:
            subject = mark.get("subject")
            grade = mark.get("grade")

            if not subject or not grade:
                return jsonify({"message": "Subject and grade required"}), 400

            if grade not in grade_map:
                return jsonify({"message": f"Invalid grade: {grade}"}), 400

            subject_dict[subject] = grade_map[grade]

        # -----------------------------
        # BUILD FEATURE VECTOR (11)
        # -----------------------------
        numeric_grades = [
            subject_dict.get(sub, 0) for sub in EXPECTED_SUBJECTS
        ]

        # -----------------------------
        # ML PREDICTION
        # -----------------------------
        if model_available:
            try:
                X = pd.DataFrame([numeric_grades], columns=EXPECTED_SUBJECTS)
                prediction = model.predict(X)
                performance = le.inverse_transform(prediction)[0]
            except Exception as e:
                print("ML Error:", str(e))
                performance = "Unknown"
        else:
            performance = "Unavailable"

        # -----------------------------
        # ADVANCED ANALYSIS
        # -----------------------------
        weak_subjects = []
        strong_subjects = []

        for sub, score in zip(EXPECTED_SUBJECTS, numeric_grades):
            if score <= 5:
                weak_subjects.append(sub)
            elif score >= 8:
                strong_subjects.append(sub)

        theory_scores = [subject_dict.get(sub, 0) for sub in THEORY_SUBJECTS]
        comp_scores = [subject_dict.get(sub, 0) for sub in COMPUTATIONAL_SUBJECTS]

        theory_avg = sum(theory_scores) / len(THEORY_SUBJECTS)
        comp_avg = sum(comp_scores) / len(COMPUTATIONAL_SUBJECTS)

        # -----------------------------
        # BUILD ANALYSIS MESSAGE
        # -----------------------------
        analysis_parts = []

        analysis_map = {
            "Excellent": "Outstanding performance across subjects.",
            "Good": "Consistent and above average performance.",
            "Average": "You need improvement in some subjects.",
            "Poor": "Performance is weak and needs serious attention."
        }

        analysis_parts.append(analysis_map.get(performance, "Performance evaluated."))

        if weak_subjects:
            analysis_parts.append(f"Focus more on: {', '.join(weak_subjects)}.")

        if strong_subjects:
            analysis_parts.append(f"Your strengths: {', '.join(strong_subjects)}.")

        if theory_avg < comp_avg:
            analysis_parts.append(
                "Your theory subjects are weaker. Improve conceptual understanding and revision."
            )
        elif comp_avg < theory_avg:
            analysis_parts.append(
                "Your computational subjects are weaker. Improve problem-solving and logical thinking."
            )

        analysis = " ".join(analysis_parts)

        # -----------------------------
        # GPA + PERCENTAGE
        # -----------------------------
        gpa = sum(numeric_grades) / len(numeric_grades)
        percentage = (gpa / 10) * 100

        # -----------------------------
        # SAVE TO DB
        # -----------------------------
        mongo.db.marks.update_one(
            {"student_id": student_id},
            {
                "$set": {
                    "student_id": student_id,
                    "marks": marks_data,
                    "performance_level": performance,
                    "analysis": analysis,
                    "gpa": round(gpa, 2),
                    "percentage": round(percentage, 2),
                    "updated_at": datetime.utcnow()
                },
                "$setOnInsert": {
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )

        return jsonify({
            "message": "Marks saved successfully",
            "performance": performance,
            "analysis": analysis,
            "gpa": round(gpa, 2),
            "percentage": round(percentage, 2)
        }), 200

    except Exception as e:
        return jsonify({"message": f"Error saving marks: {str(e)}"}), 500


# =====================================================
# GET MARKS
# =====================================================
@performance_bp.route("/marks", methods=["GET"])
@token_required
def get_marks():
    try:
        student_id = ObjectId(request.user["user_id"])
        record = mongo.db.marks.find_one({"student_id": student_id})

        if not record:
            return jsonify({"message": "No marks found"}), 404

        return jsonify({
            "marks": record.get("marks", []),
            "performance_level": record.get("performance_level"),
            "analysis": record.get("analysis"),
            "gpa": record.get("gpa"),
            "percentage": record.get("percentage"),
            "updated_at": record.get("updated_at").isoformat() if record.get("updated_at") else None
        }), 200

    except Exception as e:
        return jsonify({"message": f"Error retrieving marks: {str(e)}"}), 500