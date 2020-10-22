import sys
import json
import traceback
import functools
from bson import ObjectId
from flask import request
from flask_api import status as s
from .extensions import mongo
from datetime import datetime


class SerializeMongo(json.JSONEncoder):
    """ Serialize mongo JSON object. """

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def encode(value):
    return SerializeMongo().encode(value)


def json_response(source):
    """ Standardize JSON response."""
    if type(source) is not dict:
        raise TypeError
    destination = {
        "inserted_user": False,
        "updated_user": False,
        "updated_config": False,
        "inserted_log": False,
        "deleted_log": False,
        "data_retrieved": False,
        "user_id": None,
        "log_id": None,
        "body": None,
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
            print(traceback_string)
            return json_response({"server_error": traceback_string}), s.HTTP_500_INTERNAL_SERVER_ERROR

    return wrapper


def _has_metadata():
    """ If user is unknown, refuse service. (PRIVATE) """
    data = request.json
    if "metadata" not in data.keys():
        return encode({"message", "Permission denied."}), s.HTTP_401_UNAUTHORIZED
    required_keys = ("discord_id", "username", "discriminator", "timestamp")
    for key in required_keys:
        if key not in data["metadata"].keys():
            return encode({"message", "Permission denied."}), s.HTTP_401_UNAUTHORIZED

def has_metadata(func):
    """ If user is unknown, refuse service. """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        _has_metadata()
        return func(*args, **kwargs)

    return wrapper


def superuser_only(func):
    """ If user is not a superuser, refuse service. """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user_col = mongo.db.users
        discord_id = request.json["metadata"]["discord_id"]
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)
        if not existing_user or not existing_user["superuser"]:
            return encode({"message": "Permission denied."}), s.HTTP_401_UNAUTHORIZED
        return func(*args, **kwargs)

    return wrapper


def freeze_if_frozen(func):
    """ If user is frozen, refuse service. """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user_col = mongo.db.users
        discord_id = request.json["metadata"]["discord_id"]
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)
        if existing_user and existing_user["frozen"]:
            return encode({"message", "Permission denied."}), s.HTTP_401_UNAUTHORIZED
        return func(*args, **kwargs)

    return wrapper

def create_new_user(data):
    """ Standardized User Object. """
    return {
                "_id": data["metadata"]["discord_id"],
                "username": data["metadata"]["username"],
                "discriminator": data["metadata"]["discriminator"],
                "cumulative_hours": 0,
                "outreach_count": 0,
                "superuser": False,
                "last_updated": datetime.now(),
                "frozen": False,
                "last_used_name": ""
            }