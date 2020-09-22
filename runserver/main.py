from flask import BluePrint, jsonify
from .extensions import mongo

app = BluePrint('main', __name__)

@app.route('/')
def index():
    entry = {'name': 'Adil'}
    user_collection = mongo.db.users
    user_collection.insert(entry)
    return jsonify(entry)