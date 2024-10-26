from dotenv import load_dotenv

import os

load_dotenv(".env")

class EnvironmentalVariable(Exception):
    pass

def get_env(var: str):
    os_var = os.getenv(var)
    if os_var is None:
        raise EnvironmentalVariable(f"environmental variable '{var}' not found")
    return os_var

class Config:
    # Flask
    SECRET_KEY = get_env('SECRET_KEY')
    BUNDLE_ERRORS = True
    DEBUG = True
    DOMAIN = get_env("DOMAIN")
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    # ItsDangerous
    ITSDANGEROUS_SECRET_KEY = get_env('ITSDANGEROUS_SECRET_KEY')
    ITSDANGEROUS_TIMED_SECRET_KEY = get_env('ITSDANGEROUS_TIMED_SECRET_KEY')

    # Flask Mongoengine
    MONGODB_SETTINGS = [{
        "host": get_env("MONGODB_HOST"),
        "db": get_env("MONGODB_DB")
    }]

    # Flask Mail
    MAIL_DEBUG = False
    MAIL_SERVER = get_env("MAIL_SMTP_SERVER")
    MAIL_PORT = get_env("MAIL_SMTP_PORT")
    MAIL_USERNAME = get_env("MAIL_USERNAME")
    MAIL_PASSWORD = get_env("MAIL_PASSWORD")
    MAIL_IMAP_SERVER = get_env("MAIL_IMAP_SERVER")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

class TestConfig(Config):
    TESTING = True

    MONGODB_SETTINGS = [{
        "host": get_env("MONGODB_HOST"),
        "db": f"{get_env('MONGODB_DB')}_test"
    }]

class ProductionConfig(Config):
    TESTING = False
    DEBUG = False
