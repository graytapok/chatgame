from dotenv import load_dotenv

import os

load_dotenv(".env")

class EnvironmentalVariable(Exception):
    pass

def check_env_var(var):
    os_var = os.getenv(var)
    if os_var is None:
        raise EnvironmentalVariable(f"environmental variable '{var}' not found")
    return os_var

class Config:
    # Flask
    SECRET_KEY = check_env_var('SECRET_KEY')
    BUNDLE_ERRORS = True
    DOMAIN = check_env_var("DOMAIN")

    # ItsDangerous
    ITSDANGEROUS_SECRET_KEY = check_env_var('ITSDANGEROUS_SECRET_KEY')
    ITSDANGEROUS_TIMED_SECRET_KEY = check_env_var('ITSDANGEROUS_TIMED_SECRET_KEY')

    # Flask Mongoengine
    MONGODB_SETTINGS = [{
        "host": check_env_var("MONGODB_HOST"),
        "db": check_env_var("MONGODB_DB")
    }]

    # Flask Mail
    MAIL_DEBUG = False
    MAIL_SERVER = check_env_var("MAIL_SMTP_SERVER")
    MAIL_PORT = check_env_var("MAIL_SMTP_PORT")
    MAIL_USERNAME = check_env_var("MAIL_USERNAME")
    MAIL_PASSWORD = check_env_var("MAIL_PASSWORD")
    MAIL_IMAP_SERVER = check_env_var("MAIL_IMAP_SERVER")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # Flask Session
    SESSION_TYPE = "mongodb"
    SESSION_PERMANENT = False
    SESSION_USER_SIGNER = True
    SESSION_MONGODB_DB = check_env_var("MONGODB_DB")  # Database
    SESSION_COOKIE_SECURE = True

class TestConfig(Config):
    TEST = True

    MONGODB_SETTINGS = [{
        "host": check_env_var("MONGODB_HOST"),
        "db": f"{check_env_var('MONGODB_DB')}_test"
    }]

    SESSION_MONGODB_DB = f"{check_env_var('MONGODB_DB')}_test"
