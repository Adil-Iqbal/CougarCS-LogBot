import dateutil.parser
from datetime import datetime, timedelta
from flask import Blueprint, request, current_app
from flask_api import status as s
from bson import ObjectId
from .extensions import mongo
from .util import json_response, forward_error, encode, superuser_only, has_metadata, _has_metadata, create_new_user

app = Blueprint('main', __name__)


# @app.route('/seed', methods=['POST', 'GET'])
# def seed_db():
#     """ Seed database with values. """
#     response_obj = {}
#     log_col = mongo.db.logs
#     if request.method == 'POST':
#         data = request.json
#         user_col = mongo.db.users
#         if 'users' in data.keys() and type(data['users']) is list and len(data['users']) > 0:
#             for i, user in enumerate(data['users']):
#                 user['last_updated'] = datetime.fromisoformat(user['last_updated'])
#                 data['users'][i] = user
#             user_col.insert_many(data['users'])

#         if 'logs' in data.keys() and type(data['logs']) is list and len(data['logs']) > 0:
#             for i, log in enumerate(data['logs']):
#                 log['date'] = datetime.fromisoformat(log['date'])
#                 log['submitted'] = datetime.fromisoformat(log['submitted'])
#                 data['logs'][i] = log
#             log_col.insert_many(data['logs'])
    
#     if request.method == 'GET':
#         outreach_logs = {"volunteer type":{"$eq":"outreach"}}
#         not_outreach_logs = {"volunteer type":{"$ne":"outreach"}}
#         log_col.update_many(outreach_logs, {"$set":{"outreach count": 1}})
#         log_col.update_many(not_outreach_logs, {"$set":{"outreach count": 0}})
        
#     return json_response(response_obj), s.HTTP_200_OK

@app.route('/recognize', methods=['GET'])
@forward_error
@superuser_only
def recognize():
    response_obj = {}
    if request.method == "GET":
        log_col = mongo.db.logs

        time_interval = 14
        steady_threshold = 0.05

        end = datetime.today()
        tdelta = timedelta(days=time_interval)
        start = end - tdelta
        prev_start = start - tdelta
        next = end + tdelta

        users = list(mongo.db.users.find({}))

        improved_users = []
        steady_users = []
        remaining_users = []

        def sort_user(user, prev_hr, curr_hr):
            """ Sort users into separate categories. """
            if prev_hr == 0 and curr_hr == 0:
                return
            
            delta = round((curr_hr - prev_hr) / (prev_hr + 0.01), 4)
            entry = {
                "user": user,
                "prev_hours": prev_hr,
                "curr_hours": curr_hr,
                "delta": delta * 100
            },
            if delta >= -steady_threshold and delta <= steady_threshold:
                steady_users.append(entry)
            elif delta > steady_threshold:
                improved_users.append(entry)
            else:
                remaining_users.append(entry)

        prev_data = []
        curr_data = []

        for user in users:
            base = { 
                "discord_id": {"$eq": user["_id"]},
                "duration": {"$gt": 0} 
            }
            start_to_end = { "date": {"$gte": start, "$lt": end } }
            prev_to_start = { "date": {"$gte": prev_start, "$lt": start } }

            pte_results = list(log_col.find({**base, **prev_to_start}))
            ste_results = list(log_col.find({**base, **start_to_end}))

            curr_hours = 0
            for ste_log in ste_results:
                curr_hours += ste_log["duration"]
            
            prev_hours = 0
            for pte_log in pte_results:
                prev_hours += pte_log["duration"]
            
            curr_data.append(curr_hours)
            prev_data.append(prev_hours)

            sort_user(user, prev_hours, curr_hours)

        sort_by_delta = lambda e : e['delta'] if type(e) is dict else e[0]['delta']
        sort_by_abs_delta = lambda e : abs(e['delta']) if type(e) is dict else abs(e[0]['delta'])
        sort_by_hours = lambda e : e['curr_hours'] if type(e) is dict else e[0]['curr_hours']
        max_users = [*steady_users, *improved_users, *remaining_users]

        steady_users.sort(key=sort_by_abs_delta)
        improved_users.sort(reverse=True, key=sort_by_delta)
        remaining_users.sort(reverse=True, key=sort_by_delta)
        max_users.sort(reverse=True, key=sort_by_hours)
        max_users = max_users[0:10]

        response_obj['body'] = {
            'steady_users': steady_users,
            'improved_users': improved_users,
            'remaining_users': remaining_users,
            'max_users': max_users,
            'prev_data': prev_data,
            'curr_data': curr_data,
            'dates': {
                'start': start,
                'prev_start': prev_start,
                'next': next,
                'end': end
            }
        }
        
        return json_response(response_obj), s.HTTP_200_OK
        


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
        outreach_increment = data["outreach count"]

        # Create new log.
        log = {
            "name": data["name"],
            "date": dateutil.parser.isoparse(data["date"]),
            "volunteer type": data["volunteer type"],
            "duration": 0 if data["duration"] is None else data["duration"],
            "outreach count": outreach_increment,
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
                "cumulative_hours": round(existing_user["cumulative_hours"] + duration_increment, 2),
                "outreach_count": int(round(existing_user["outreach_count"] + outreach_increment, 0)),
                "last_updated": datetime.utcnow(),
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
    user_col = mongo.db.users

    response_obj = {}

    if request.method == "GET":

        # Get and existing config.
        config_id = ObjectId(current_app.config['CONFIG_ID'])
        config_query = {"_id": {"$eq": config_id}}
        config = config_col.find_one(config_query)

        # Get all superusers.
        superuser_query = {"superuser": {"$eq": True}}
        superusers = list(user_col.find(superuser_query))
        superuser_id_list = [user["_id"] for user in superusers]

        # Remove sensitive data.
        del config['_id']

        # Send config.
        response_obj['body'] = {
            "config": config,
            "superusers": superuser_id_list
        }
        response_obj['message'] = 'config retrieved'
        return json_response(response_obj), s.HTTP_200_OK


@app.route('/users/name/<string:discord_id>', methods=['GET', 'UPDATE'])
@forward_error
def check_for_name(discord_id):
    """ Retrieve and update user's last used name field value. """
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
    
    if request.method == "UPDATE":
        _has_metadata()
        existing_user_query = {"_id": {"$eq": discord_id}}
        existing_user = user_col.find_one(existing_user_query)
        data = request.json

        if not existing_user:
            new_user = create_new_user(data)
            result = user_col.insert_one(new_user)
            response_obj["inserted_user"] = result.acknowledged
            response_obj["user_id"] = discord_id
            response_obj["data_retrieved"] = False
            existing_user = new_user
        else:
            response_obj["data_retrieved"] = True

        if existing_user["frozen"] == True and existing_user["superuser"] == False:
            return encode({"message": "Permission denied."}), s.HTTP_401_UNAUTHORIZED

        updated_values = {
            "username": data["metadata"]["username"],
            "discriminator": data["metadata"]["discriminator"],
            "last_updated": datetime.utcnow(),
            "last_used_name": data["new_name"]
        }

        up_res = user_col.update_one(existing_user_query, {"$set": updated_values})
        if up_res.modified_count == 1:
            response_obj["updated_user"] = up_res.acknowledged
            response_obj["user_id"] = discord_id
            response_obj["body"] = [updated_values["last_used_name"]]
        
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
        if existing_log["duration"] is not None:
            existing_user["cumulative_hours"] -= 0 if existing_log["duration"] is None else existing_log["duration"]
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
