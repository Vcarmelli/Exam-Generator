from flask import Flask


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
    print(secret_key)

    app.secret_key = secret_key
    return app