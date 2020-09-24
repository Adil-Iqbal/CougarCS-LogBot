import json
from bson import ObjectId
from flask_pymongo import PyMongo

mongo = PyMongo()


class SerializeMongo(json.JSONEncoder):
    """ Serialize mongo JSON object. """
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
