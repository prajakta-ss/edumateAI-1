from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import mongo

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.config.from_object(Config)

#  Initialize FIRST
mongo.init_app(app)

#  Import AFTER init (CRITICAL FIX)
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.face_routes import face_bp
from routes.stress_routes import stress_bp
from routes.performance_routes import performance_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(face_bp, url_prefix="/api/face")
app.register_blueprint(stress_bp, url_prefix="/api/stress")
app.register_blueprint(performance_bp, url_prefix="/api/performance")

print("Auth blueprint registered")


@app.route("/test")
def test():
    return "Backend OK"

if __name__ == "__main__":
    app.run(debug=True)