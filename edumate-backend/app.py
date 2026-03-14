from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.face_routes import face_bp
from routes.stress_routes import stress_bp


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.config.from_object(Config)

mongo = PyMongo(app)


# Attach mongo to app
app.mongo = mongo

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(face_bp, url_prefix="/api/face")
app.register_blueprint(stress_bp, url_prefix="/api/stress")
print("Auth blueprint registered")
@app.route("/test")
def test():
    return "Backend OK"


if __name__ == "__main__":
    app.run(debug=True)
