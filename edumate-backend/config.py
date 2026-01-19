import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = "super-secret-key-change-this"
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET = "jwt-secret-key"