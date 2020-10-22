import dateutil.parser
from datetime import datetime
from flask import Blueprint, request, current_app
from flask_api import status as s
from bson import ObjectId
from .extensions import mongo
from .util import json_response, forward_error, encode, superuser_only, has_metadata, create_new_user

app = Blueprint('main', __name__)


@app.route('/logs', methods=['POST'])
@forward_error
@has_metadata
def log_request():
    """ Post a log request to the database. """
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
        if result.acknowledged:
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
                "last_used_name": data["name"]
            }
            up_res = user_col.update_one(existing_user_query, {"$set": updated_values})
            if up_res.modified_count == 1:
                response_obj["updated_user"] = up_res.acknowledged
                response_obj["user_id"] = discord_id

        # If user does not exist, create new one.
        else:
            new_user = create_new_user(data)
            new_user["cumulative_hours"] = duration_increment
            new_user["outreach_count"] = outreach_increment
            result = user_col.insert_one(new_user)
            response_obj["inserted_user"] = result.acknowledged
            response_obj["user_id"] = discord_id

    # Return response.
    return json_response(response_obj), s.HTTP_200_OK


@app.route('/config', methods=['UPDATE'])
@forward_error
@has_metadata
@superuser_only
def configuration():
    """ Update log bot configuration. """
    config_col = mongo.db.config
    response_obj = {}

    if request.method == "UPDATE":
        # Get and clean new config data.
        updated_config = request.json
        del updated_config['metadata']

        # Retrieve database config ID.
        config_id = ObjectId(current_app.config['CONFIG_ID'])
        config_query = {"_id": {"$eq": config_id}}

        # Update database config info.
        up_res = config_col.update_one(config_query, {"$set": updated_config})
        if up_res.modified_count == 1:
            response_obj["updated_config"] = up_res.acknowledged
            response_obj["message"] = "config was updated"
            return json_response(response_obj), s.HTTP_200_OK
        
        # Expectation failed.
        response_obj["message"] = "db failed to update"
        return json_response(response_obj), s.HTTP_417_EXPECTATION_FAILED


@app.route('/config', methods=['GET'])
@forward_error
def initialize():
    """ Retrieve existing log bot configuration. """
    config_col = mongo.db.config
    response_obj = {}

    if request.method == "GET":

        # Get and existing config.
        config_id = ObjectId(current_app.config['CONFIG_ID'])
        config_query = {"_id": {"$eq": config_id}}
        config = config_col.find_one(config_query)

        # Remove sensitive data.
        del config['_id']

        # Send config.
        response_obj['body'] = config
        response_obj['message'] = 'config retrieved'
        return json_response(response_obj), s.HTTP_200_OK


@app.route('/users/name/<string:discord_id>', methods=['GET'])
@forward_error
def check_for_name(discord_id):
    """ Retrieve user's last used name field value. """
    user_col = mongo.db.users
    response_obj = {}

    if request.method == "GET":
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)

        if existing_user and "last_used_name" in existing_user.keys():
            response_obj["body"] = [existing_user["last_used_name"]]
            response_obj["data_retrieved"] = True
        else:
            response_obj["body"] = [""]

        return json_response(response_obj), s.HTTP_200_OK


@app.route('/users/stats/<string:discord_id>', methods=['POST'])
@forward_error
@has_metadata
def get_user_stats(discord_id):
    """ Retrieve user's stat totals. """
    user_col = mongo.db.users
    response_obj = {}

    if request.method == "POST":
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)

        # If user not found in database, create new user.
        if not existing_user:
            new_user = create_new_user(request.json)
            result = user_col.insert_one(new_user)
            response_obj["inserted_user"] = result.acknowledged
            response_obj["user_id"] = discord_id
            response_obj["data_retrieved"] = False
            existing_user = new_user
        else:
            response_obj["data_retrieved"] = True

        response_obj["body"] = [
            existing_user["cumulative_hours"],
            existing_user["outreach_count"]
        ]

        return json_response(response_obj), s.HTTP_200_OK


@app.route('/logs/<string:discord_id>/<string:conf_num>', methods=['DELETE'])
@forward_error
def delete_log(discord_id, conf_num):
    """ Delete log request from the database. """
    log_col = mongo.db.logs
    user_col = mongo.db.users
    response_obj = {}

    if request.method == "DELETE":
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)

        # User not found in database.
        if not existing_user:
            return json_response({"message": "user not found"}), s.HTTP_404_NOT_FOUND

        # Prevent frozen users from altering database.
        if not existing_user["superuser"]:
            if existing_user["frozen"]:
                return json_response({"message": "Permission Denied"}), s.HTTP_401_UNAUTHORIZED
        
        existing_log_query = {"_id": {"$eq": ObjectId(conf_num)}}
        existing_log = log_col.find_one(existing_log_query)

        if not existing_log:
            return json_response({"message": "log not found"}), s.HTTP_404_NOT_FOUND
        
        # Prevent a user who does not own this log from deleting it.
        if not existing_user["superuser"]:
            if existing_log["discord_id"] != existing_user["_id"]:
                return json_response({"message": "Permission Denied"}), s.HTTP_401_UNAUTHORIZED
        
        # Prime user object to update stats.
        existing_user["cumulative_hours"] -= existing_log["duration"]
        existing_user["outreach_count"] -= 1 if existing_log["volunteer type"] == "outreach" else 0

        # Delete log.
        result = log_col.delete_one(existing_log_query)
        if result.deleted_count == 1:
            response_obj["deleted_log"] = True
            response_obj["log_id"] = str(existing_log["_id"])
            response_obj["message"] = "log was deleted"

            # Update user stats.
            up_res = user_col.update_one(existing_user_query, {"$set": existing_user})
            if up_res.modified_count == 1:
                response_obj["updated_user"] = True
                response_obj["user_id"] = existing_log["discord_id"]
                response_obj["message"] += " and user was updated."
            else:
                response_obj["message"] += " and user was NOT updated."
                return json_response(response_obj), s.HTTP_417_EXPECTATION_FAILED
        else:
            response_obj["message"] = "nothing was changed."
            return json_response(response_obj), s.HTTP_417_EXPECTATION_FAILED

        return json_response(response_obj), s.HTTP_200_OK
