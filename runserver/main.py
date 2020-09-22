import json
from flask import Blueprint, request
from .extensions import mongo, SerializeMongo

app = Blueprint('main', __name__)


@app.route('/logs', methods=['POST'])
def log_request():
    if request.method == 'POST':
        post = request.json
        collection = mongo.db.logs
        result = collection.insert_one(post)
        return SerializeMongo().encode({
            "id": result.inserted_id,
            "inserted": result.acknowledged
        })
