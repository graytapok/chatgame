import os
from dotenv import load_dotenv

load_dotenv(".env")

class Config(object):
    # Flask
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    DOMAIN = os.getenv("DOMAIN")
    SESSION_COOKIE_SECURE = True

    # ItsDangerous
    ITSDANGEROUS_SECRET_KEY = os.getenv('ITSDANGEROUS_SECRET_KEY')

    # Flask Mongoengine
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URL")

    # Flask Mail
    MAIL_DEBUG = False
    MAIL_SERVER = os.getenv("MAIL_SMTP_SERVER")
    MAIL_PORT = os.getenv("MAIL_SMTP_PORT")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_IMAP_SERVER = os.getenv("MAIL_IMAP_SERVER")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True


class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = True


class TestConfig(Config):
    DEBUG = True
    TESTING = True

    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DB_URL")


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
