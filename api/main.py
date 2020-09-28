import dateutil.parser
from datetime import datetime
from flask import Blueprint, request, current_app
from flask_api import status as s
from bson import ObjectId
from .extensions import mongo
from .util import json_response, forward_error, encode, freeze_if_frozen, superuser_only

app = Blueprint('main', __name__)


@app.route('/logs', methods=['POST'])
@forward_error
def log_request():

    response_obj = {}
    if request.method == 'POST':

        # Access collections.
        log_col = mongo.db.logs
        user_col = mongo.db.users

        # Retrieve request data and init response.
        data = request.json
        discord_id = data["metadata"]["discord_id"]

        # Process duration and outreach.
        duration_increment = data["duration"] if data["duration"] is not None else 0
        outreach_increment = 1 if data["volunteer type"] == "outreach" else 0

        # Create new log.
        log = {
            "name": data["name"],
            "date": dateutil.parser.isoparse(data["date"]),
            "volunteer type": data["volunteer type"],
            "duration": data["duration"],
            "comment": data["comment"],
            "discord_id": discord_id,
            "submitted": dateutil.parser.isoparse(data["metadata"]["timestamp"]),
        }
        result = log_col.insert_one(log)
        response_obj["inserted_log"] = result.acknowledged
        response_obj["log_id"] = result.inserted_id

        # Retrieve existing user, if any.
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)

        # If user exists, update him/her.
        if existing_user:
            if existing_user["frozen"] == True and existing_user["superuser"] == False:
                return encode({"message": "Permission denied."}), s.HTTP_401_UNAUTHORIZED
            updated_values = {
                "username": data["metadata"]["username"],
                "discriminator": data["metadata"]["discriminator"],
                "cumulative_hours": existing_user["cumulative_hours"] + duration_increment,
                "outreach_count": existing_user["outreach_count"] + outreach_increment,
                "last_updated": datetime.now(),
            }
            up_res = user_col.update_one(existing_user_query, {"$set": updated_values})
            if up_res.modified_count == 1:
                response_obj["updated_user"] = up_res.acknowledged
                response_obj["user_id"] = discord_id

        # If user does not exist, create new one.
        else:
            new_user = {
                "_id": discord_id,
                "username": data["metadata"]["username"],
                "discriminator": data["metadata"]["discriminator"],
                "cumulative_hours": duration_increment,
                "outreach_count": outreach_increment,
                "superuser": False,
                "last_updated": datetime.now(),
                "frozen": False,
            }
            user_col.insert_one(new_user)
            response_obj["inserted_user"] = result.acknowledged
            response_obj["user_id"] = discord_id

    # Return response.
    return json_response(response_obj)


@app.route('/config', methods=['UPDATE'])
@forward_error
@superuser_only
def configuration():
    config_col = mongo.db.config
    response_obj = {}

    if request.method == "UPDATE":
        updated_config = request.json
        del updated_config['metadata']
        config_id = ObjectId(current_app.config['CONFIG_ID'])
        config_query = {"_id": {"$eq": config_id}}

        up_res = config_col.update_one(config_query, {"$set": updated_config})
        if up_res.modified_count == 1:
            response_obj["updated_config"] = up_res.acknowledged
            response_obj["message"] = "config was updated"
        return json_response(response_obj), s.HTTP_200_OK


@app.route('/config', methods=['GET'])
@forward_error
def initialize():
    config_col = mongo.db.config
    response_obj = {}
    if request.method == "GET":
        config_id = ObjectId(current_app.config['CONFIG_ID'])
        config_query = {"_id": {"$eq": config_id}}
        config = config_col.find_one(config_query)
        del config['_id']
        del config['host']
        response_obj['config'] = config
        response_obj['message'] = 'config retrieved'
        return json_response(response_obj), s.HTTP_200_OK