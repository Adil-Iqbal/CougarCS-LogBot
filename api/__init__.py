from flask import Flask
from .extensions import mongo
from .main import app as _app


def create_app(config_object='api.settings'):
    app = Flask(__name__)
    app.config.from_object(config_object)
    mongo.init_app(app)
    app.register_blueprint(_app)
    return app