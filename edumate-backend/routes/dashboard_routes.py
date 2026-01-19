from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import token_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard():
    return jsonify({
        "message": "Welcome to dashboard",
        "user": request.user
    })
