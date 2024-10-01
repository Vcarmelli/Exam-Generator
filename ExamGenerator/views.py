from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/')
def index():
    return render_template('index.html')

@views.route('/upload')
def upload():
    return render_template('upload.html')  


@views.route('/score')
def score():
    return render_template('score.html')

@views.route('/download')
def download():
    return render_template('download.html')