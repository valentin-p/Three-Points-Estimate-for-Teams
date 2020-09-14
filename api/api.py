import time
import string
import random
from flask import Flask, request

app = Flask(__name__)

points_dict = {}
users = []
defaultUsers = tuple(["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel"])

@app.route('/api/users', methods=['GET', 'POST'])
def get_current_users():
    global users
    if request.method == 'GET':
        return {'users': users }

@app.route('/api/users/reset', methods=['GET', 'POST'])
def get_users_reset():
    global users
    users = []
    return {}

@app.route('/api/user/assign', methods=['GET'])
def get_assign_user():
    global users
    global defaultUsers
    if len(users) == len(defaultUsers):
           return "No names available", 400
    for new_user in defaultUsers:
        if not new_user in users:
            user = new_user
            break
    users.append(user)
    return {'user': user}

@app.route('/api/user/release', methods=['GET', 'POST'])
def post_release_user():
    form = request.args if request.method == 'GET' else request.form
    user = form["user"]
    global users
    if not user in users:
        return {'error': "User not assigned"}
    users.remove(user)
    return {}
 
@app.route('/api/points/total', methods=['GET', 'POST'])
def get_points_total():
    # form = request.args if request.method == 'GET' else request.form
    global points_dict
    global users
    missingUsers = list(users - points_dict.keys())
    waitingFor = "anyone to connect." if not users else ",".join(missingUsers)
    status = "empty" if not points_dict else ("ready" if not missingUsers else "waiting")
    results = f"{(sum([(o+4*m+p) for o,m,p in points_dict.values()]) / (len(points_dict)*6)):.2f}" if any(points_dict) else "0"
    hash_code = 487
    for w in users + [str(31*o+31*m+31*p) for o,m,p in points_dict.values()]:
        hash_code = hash_code*31 + hash(w)
    return {
        'results': results,
        'status': status,
        'waitingFor': waitingFor,
        'hashCode': str(hash_code),
    }

@app.route('/api/points/raw', methods=['GET', 'POST'])
def get_points_raw():
    # form = request.args if request.method == 'GET' else request.form
    global users
    global points_dict
    return {'dict': points_dict, 'users': users}

@app.route('/api/points/reset', methods=['GET', 'POST'])
def get_points_reset():
    # form = request.args if request.method == 'GET' else request.form
    global points_dict
    points_dict = {}
    return {}

@app.route('/api/points/submit', methods=['GET', 'POST'])
def post_points_submit():
    form = request.args if request.method == 'GET' else request.form
    user = form["user"]
    optimistic = float(form["o"])
    mostLikely = float(form["m"])
    pessimistic = float(form["p"])
    global points_dict
    points_dict[user] = [optimistic,mostLikely,pessimistic]
    return {}


@app.route('/api/all/reset', methods=['GET', 'POST'])
def get_reset_all():
    get_points_reset()
    get_users_reset()
    return {}