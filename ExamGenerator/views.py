from flask import Blueprint, current_app, render_template, redirect, url_for, request, session, jsonify
from flask_login import login_required, current_user
from .util import convert_file_to_thumbnail, parse_page_ranges, parse_result, extract_text, generate_questions
import os
import json

views = Blueprint('views', __name__)


@views.route('/')
def index():
    return render_template('index.html')

@views.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@views.route('/dashboard1')
def dashboard1():
    return render_template('dashboard1.html')


@views.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return render_template('upload.html') 
    
    elif request.method == 'POST':
        if 'input_file' not in request.files:
            return redirect(request.url)

        file = request.files['input_file']
        if file.filename == '':
            return redirect(request.url)
        
        session['file_path'] = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(session['file_path'])

        return redirect(url_for('views.selection', file_name=file.filename))


@views.route('/selection',  methods=['GET', 'POST'])
def selection():
    if request.method == 'GET':
        file_path = session.get('file_path')
        if not file_path:
            return redirect(url_for('views.upload'))

        filename = request.args.get('file_name')
        thumbnails = convert_file_to_thumbnail(file_path, current_app.config['THUMBNAIL_FOLDER'], start_page=0, end_page=10)
        return render_template('preview.html', filename=filename, thumbnails=thumbnails)
    
    elif request.method == 'POST':
        filename = request.form.get('filename')
        page_selection = request.form.get('page-selection')
        pages = request.form.get('pages')
        pages = parse_page_ranges(pages)
        question_types = request.form.getlist('ques-type')
        question_quantities = request.form.getlist('ques-num')

        # Process questions and quantities
        questions = [{'type': qt, 'quantity': int(qn)} for qt, qn in zip(question_types, question_quantities) if qn.isdigit()]
        
        # NOTE: FORM VALIDATION HERE

        print(f"Filename: {filename}")
        print(f"Page Selection: {page_selection}")
        print(f"Pages: {pages}")

        text = ''
        try:
            text = extract_text(session['file_path'], pages)
        except KeyError:
            return redirect(url_for('views.upload'))

        session['questions'] = questions
        session['text'] = text

        return redirect(url_for('views.download'))

@views.route('/download')
def download():
    questions = session.get('questions', [])
    text = session.get('text', '')

    # Debugging output to verify the content of `questions` and `text`
    print("Questions from session:", questions)
    print("Text from session:", text)

    for question in questions:
        question_type = question.get('type')
        num_questions = question.get('quantity')
        print(f"Preparing to generate {num_questions} {question_type} question/s.")

    result = generate_questions(questions, text)
    generated_questions = parse_result(result) # extract question, choices, answer from model's response
    print("Parsed result:")
    print(json.dumps(generated_questions, indent=2))

    session['generated_questions'] = generated_questions

    return render_template('download.html') # download page shows the generated question and button to continue to quiz


@views.route('/review-questions')
def review_questions():
    generated_questions = []
    try:
        generated_questions = session.get('generated_questions', {})
    except KeyError:
        return jsonify({'message': 'No questions generated.'}), 400
    
    return render_template('review-ques.html', generated_questions=generated_questions)


@views.route('/done')
def done():
    return render_template('done.html') 


@views.route('/quiz-complete', methods=['GET', 'POST'])
def quiz_complete():
    score = request.args.get('score', 0)
    total = request.args.get('total', 0)

    return render_template('quiz-complete.html', score=score, total=total)




# ROUTES FOR FETCHING DATA 
@views.route('/selection/<int:page>')
def load_thumbnails(page):
    end = page + 10
    thumbnails = convert_file_to_thumbnail(session['file_path'], current_app.config['THUMBNAIL_FOLDER'], start_page=page, end_page=end)
    return jsonify(thumbnails=thumbnails)



@views.route('/quiz-complete/responses', methods=['POST'])
def responses():
    result = request.get_json()
    score = result.get('score')
    total = result.get('totalQuestion')

    return redirect( url_for('views.quiz_complete', score=score, total=total) )
