from flask import Flask
import os

def create_upload_folder():
    UPLOAD_FOLDER = os.path.join('static', 'uploads')

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    return UPLOAD_FOLDER


def create_app():
    # initialize Flask App
    app = Flask(__name__)
    
    # import and register Blueprint
    from .views import views
    from .game import game
    app.register_blueprint(views)
    app.register_blueprint(game)

    # import secrets
    # secret_key = secrets.token_hex(16)  # Generates a random 16-byte hex key
    # app.secret_key = secret_key

    # setting up uploads folder
    uploads = create_upload_folder()
    app.config['UPLOAD_FOLDER'] = uploads

    return app