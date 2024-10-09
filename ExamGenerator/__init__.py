from flask import Flask
import os


def create_upload_folder():
    # Get the current directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create path to uploads folder
    UPLOAD_FOLDER = os.path.join(base_dir, 'static', 'uploads')

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Create path to thumbnails folder
    THUMBNAILS_FOLDER = os.path.join(UPLOAD_FOLDER, 'tmp')

    if not os.path.exists(THUMBNAILS_FOLDER):
        os.makedirs(THUMBNAILS_FOLDER)

    return UPLOAD_FOLDER, THUMBNAILS_FOLDER



def create_app():
    # initialize Flask App
    app = Flask(__name__)
    
    # import and register Blueprint
    from .views import views
    from .game import game
    app.register_blueprint(views)
    app.register_blueprint(game)

    import secrets
    secret_key = secrets.token_hex(16)  # Generates a random 16-byte hex key
    app.config['SECRET_KEY'] = secret_key

    # setting up uploads folder
    uploads, thumbnails = create_upload_folder()
    app.config['UPLOAD_FOLDER'] = uploads
    app.config['THUMBNAIL_FOLDER'] = thumbnails

    return app