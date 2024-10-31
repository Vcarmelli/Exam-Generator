from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
import secrets

DB_NAME = 'database.db'
db = SQLAlchemy()
login_manager = LoginManager()


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
    secret_key = secrets.token_hex(16)  # Generates a random 16-byte hex key
    app.config['SECRET_KEY'] = secret_key
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    # setting up uploads folder
    uploads, thumbnails = create_upload_folder()
    app.config['UPLOAD_FOLDER'] = uploads
    app.config['THUMBNAIL_FOLDER'] = thumbnails

    # register Blueprints
    from .views import views
    from .game import game
    from .auth import auth
    app.register_blueprint(views)
    app.register_blueprint(game)
    app.register_blueprint(auth)

    # initialize User Database
    db.init_app(app)
    from .models import User   
    with app.app_context():
        db.create_all() 

    # initialize Login Manager
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app