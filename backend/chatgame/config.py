import os
from typing import Literal

from dotenv import load_dotenv

load_dotenv(".env")

ConfigClasses = Literal["DevelopmentConfig", "ProductionConfig", "TestConfig"]

class Config(object):
    # Flask
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    DOMAIN = os.getenv("DOMAIN")
    SESSION_COOKIE_SECURE = True

    # ItsDangerous
    ITSDANGEROUS_SECRET_KEY = os.getenv('ITSDANGEROUS_SECRET_KEY')

    # Flask Sqlalchemy
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_ECHO = False

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

    SQLALCHEMY_DATABASE_URI = f"{Config.SQLALCHEMY_DATABASE_URI}_test"


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
