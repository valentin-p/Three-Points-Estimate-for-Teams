import time
import string
from flask import Flask, request, jsonify
from .repo import Repo, DEFAULT_USER_NAMES

app = Flask('api', static_folder='../build', static_url_path='/')

repo = Repo()


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/admin')
def admin():
    return app.send_static_file('index.html')


@app.route('/robot.txt')
def robot():
    return app.send_static_file('robot.txt')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/users', methods=['GET', 'POST'])
def get_current_users():
    users = repo.get_users()
    return {'users': users}


@app.route('/api/users/reset', methods=['GET', 'POST'])
def get_users_reset():
    repo.clear_users()
    return {}


@app.route('/api/user/assign', methods=['GET', 'POST'])
def get_assign_user():
    form = request.args if request.method == 'GET' else request.form
    name = form.get("name")
    users_names = repo.get_users_names()
    if name != None and not (name in users_names):
        username = name
    else:
        if len(users_names) == len(DEFAULT_USER_NAMES):
            return "No names available", 400
        username = next(
            new_user for new_user in DEFAULT_USER_NAMES if new_user not in users_names)

    repo.add_user_name(username)
    return {'user': username}


@app.route('/api/user/release', methods=['GET', 'POST'])
def post_release_user():
    form = request.args if request.method == 'GET' else request.form
    user_name = form["user"]
    repo.delete_user(user_name)
    return {}


@app.route('/api/points/total', methods=['GET', 'POST'])
def get_points_total():
    form = request.args if request.method == 'GET' else request.form
    if request.method == 'POST':
        url = form.get("url")
        if url != None:
            repo.update_url(url)
    url = repo.get_url()
    three_points = repo.get_three_points()
    missingNames = repo.get_missing_names()
    hash_code = repo.get_hash_code()

    waitingFor = "anyone to connect." if not missingNames and not three_points else ",".join(
        missingNames)
    status = "empty" if not three_points else(
        "waiting" if missingNames else "ready")
    estimates = [t.estimate() for t in three_points]
    results = f"{(sum(estimates) / len(estimates)):.2f}" if any(estimates) else "0"

    return {
        'results': results,
        'status': status,
        'waitingFor': waitingFor,
        'ticketUrl': url,
        'hashCode': str(hash_code),
    }


@app.route('/api/points/raw', methods=['GET', 'POST'])
def get_points_raw():
    users = repo.get_users()
    points_dict = repo.get_three_points()
    return {'dict': dict([e.serialize() for e in points_dict]), 'users': [e.serialize() for e in users]}


@app.route('/api/points/reset', methods=['GET', 'POST'])
def get_points_reset():
    repo.clear_three_points()
    return {}


@app.route('/api/points/submit', methods=['GET', 'POST'])
def post_points_submit():
    form = request.args if request.method == 'GET' else request.form
    repo.add_three_point_from_dict(form)
    return {}


@app.route('/api/all/reset', methods=['GET', 'POST'])
def get_reset_all():
    repo.clear_three_points()
    repo.clear_users()
    return {}


if __name__ == '__main__':
    app.run()
