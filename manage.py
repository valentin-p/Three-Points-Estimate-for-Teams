from flask_script import Manager

from api.api import app

manager = Manager(app)

if __name__ == '__main__':
    manager.run()