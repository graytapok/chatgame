from dotenv import load_dotenv
import os

load_dotenv(".env")

class Config:
    # Flask
    FLASK_APP = "app"
    SECRET_KEY = os.getenv('SECRET_KEY')
    BUNDLE_ERRORS = True
    DOMAIN = os.getenv("DOMAIN")

    # Flask Mongoengine
    MONGODB_SETTINGS = [{
        "host": os.getenv("MONGODB_URI"),
    }]

    # Flask Mail
    MAIL_DEBUG = False
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # Flask Session
    SESSION_TYPE = "mongodb"
    SESSION_PERMANENT = False
    SESSION_USER_SIGNER = True
    SESSION_MONGODB_DB = "chatgame"  # Database
    SESSION_COOKIE_SECURE = True
