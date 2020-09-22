from flask import Blueprint, jsonify, request
from .extensions import mongo

app = Blueprint('main', __name__)

@app.route('/logs', methods=['POST'])
def log():
    if request.method == 'POST':
        return {'message': 'recieved'}
