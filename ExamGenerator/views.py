from flask import Blueprint, current_app, render_template, redirect, url_for, request
import os
from .util import convert_file_to_thumbnail

views = Blueprint('views', __name__)


@views.route('/')
def index():
    return render_template('index.html')

@views.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@views.route('/dashboard1')
def dashboard1():
    return render_template('dashboard1.html')


@views.route('/upload')
def upload():
    return render_template('upload.html')  

@views.route('/done')
def done():
    return render_template('done.html') 

@views.route('/download')
def download():
    # integrate model to generate questions here

    ques_type = request.args.get('ques_type')
    return render_template('download.html', ques_type=ques_type)


@views.route('/review-questions')
def review_questions():
    ques_type = request.args.get('ques_type')
    return render_template('review-ques.html', ques_type=ques_type)

@views.route('/review-answers')
def review_answers():
    return render_template('review-ans.html')


@views.route('/selection',  methods=['GET', 'POST'])
def selection():
    if request.method == 'GET':
        file_path = request.args.get('file_path')
        filename = request.args.get('file_name')
        thumbnails = convert_file_to_thumbnail(file_path, current_app.config['THUMBNAIL_FOLDER'])

        return render_template('preview.html', filename=filename, thumbnails=thumbnails)
    
    elif request.method == 'POST':
        page_selection = request.form.get('page-selection')
        pages = request.form.get('pages')
        ques_type = request.form.get('ques-type')
        ques_num = request.form.get('ques-num')

        # NOTE: add form validation here
        
        print(f"Page Selection: {page_selection}")
        print(f"Pages: {pages}")
        print(f"Question Type: {ques_type}")
        print(f"Number of Questions: {ques_num}")

        return redirect(url_for('views.download', ques_type=ques_type))



@views.route('/quiz-complete', methods=['GET', 'POST'])
def quiz_complete():
    score = request.args.get('score')
    total = request.args.get('total')

    return render_template('quiz-complete.html', score=score, total=total)



@views.route('/upload/file', methods=['POST'])
def upload_file():
    if 'input_file' not in request.files:
        return redirect(request.url)

    file = request.files['input_file']
    if file.filename == '':
        return redirect(request.url)
    
    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        return redirect(url_for('views.selection', file_name=file.filename, file_path=file_path))
    return redirect(request.url)

    

@views.route('/quiz-complete/responses', methods=['POST'])
def responses():
    result = request.get_json()
    score = result.get('score')
    total = result.get('totalQuestion')

    return redirect( url_for('views.quiz_complete', score=score, total=total) )
