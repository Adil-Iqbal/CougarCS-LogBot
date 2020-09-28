import sys
import json
import traceback
import functools
from bson import ObjectId
from flask import request
from flask_api import status
from .extensions import mongo


class SerializeMongo(json.JSONEncoder):
    """ Serialize mongo JSON object. """

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def encode(value):
    return SerializeMongo().encode(value)


def json_response(source):
    if type(source) is not dict:
        raise TypeError
    destination = {
        "inserted_user": False,
        "updated_user": False,
        "inserted_log": False,
        "user_id": None,
        "log_id": None,
        "server_error": None,
        "message": None,
    }
    return encode({**destination, **source})


def forward_error(func):
    """ Send traceback of error to bot. """

    # noinspection PyBroadException
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            exc_type, exc_value, exc_tb = sys.exc_info()
            traceback_string = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
            return json_response({"server_error": traceback_string})

    return wrapper


def superuser_only(func):
    """ If user is not a superuser, refuse service. """

    # noinspection PyBroadException
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user_col = mongo.db.users
        try:
            discord_id = request.json["discord_id"]
        except KeyError:
            discord_id = request.json["metadata"]["discord_id"]
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)
        if not existing_user or not existing_user["superuser"]:
            return encode({"message", "Permission denied."}), status.HTTP_401_UNAUTHORIZED
        return func(*args, **kwargs)

    return wrapper


def freeze_if_frozen(func):
    """ If user is frozen, refuse service. """

    # noinspection PyBroadException
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user_col = mongo.db.users
        discord_id = request.json["metadata"]["discord_id"]
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)
        if existing_user and existing_user["frozen"]:
            return encode({"message", "Permission denied."}), status.HTTP_401_UNAUTHORIZED
        return func(*args, **kwargs)

    return wrapper
