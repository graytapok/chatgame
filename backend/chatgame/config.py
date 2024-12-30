from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

Environments = Literal["dev", "prod", "test"]

class Config(BaseSettings):
    ENV: Environments = "dev"

    # Flask
    APP: str = Field(alias="FLASK_APP")
    DEBUG: bool = Field(True if ENV != "prod" else False, alias="FLASK_DEBUG")
    TESTING: bool = True if ENV == "test" else False
    SECRET_KEY: str
    SESSION_COOKIE_SECURE: bool = True

    # General
    DOMAIN: str = "http://localhost:5173"
    FRIEND_REQUEST_EXPIRATION_IN_MINUTES: int = 60

    # ItsDangerous
    ITSDANGEROUS_SECRET_KEY: str

    # Flask Sqlalchemy
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        uri = f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

        if self.ENV == "test":
            return uri + "_test"

        return uri

    SQLALCHEMY_ECHO: bool = False

    # Flask Mail
    MAIL_DEBUG: bool = False
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_SERVER: str = Field("smtp.gmail.com", alias="MAIL_SMTP_SERVER")
    MAIL_PORT: int = Field(465, alias="MAIL_SMTP_PORT")
    MAIL_IMAP_SERVER: str = "imap.gmail.com"
    MAIL_USE_TLS: bool = False
    MAIL_USE_SSL: bool = True

    model_config = SettingsConfigDict(env_file=".env")

config = Config()