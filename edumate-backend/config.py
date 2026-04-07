import os


class Config:
    SECRET_KEY = "super-secret-key-change-this"
   
    MONGO_URI = os.getenv("MONGO_URI"),      
    JWT_SECRET = "jwt-secret-key"