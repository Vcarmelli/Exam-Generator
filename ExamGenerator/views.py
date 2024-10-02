from flask import Blueprint, render_template, redirect, url_for, request, make_response, jsonify

views = Blueprint('views', __name__)

@views.route('/')
def index():
    return render_template('index.html')

@views.route('/upload')
def upload():
    return render_template('upload.html')  

@views.route('/quiz-complete')
def quiz_complete():
    score = request.args.get('score')
    total = request.args.get('total')
    return render_template('quiz-complete.html', score=score, total=total)

@views.route('/quiz-complete/responses', methods=['POST'])
def responses():
    result = request.get_json()

    score = result.get('score')
    total = result.get('totalQuestion')

    print('RES:', result)
    response = make_response(jsonify({'message': 'JSON received'}), 200)
    #return response
    return redirect( url_for('views.quiz_complete', score=score, total=total) )


@views.route('/download')
def download():
    return render_template('download.html')