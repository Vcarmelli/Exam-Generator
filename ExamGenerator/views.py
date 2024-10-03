from flask import Blueprint, current_app, render_template, redirect, url_for, request, make_response, jsonify
import os



views = Blueprint('views', __name__)


@views.route('/')
def index():
    return render_template('index.html')

@views.route('/upload')
def upload():
    return render_template('upload.html')  

@views.route('/download')
def download():
    return render_template('download.html')

@views.route('/selection')
def selection():
    return render_template('preview.html')

@views.route('/quiz-complete')
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

        return redirect(url_for('views.selection', file_path=file_path))
    return redirect(request.url)

    

@views.route('/quiz-complete/responses', methods=['POST'])
def responses():
    result = request.get_json()

    score = result.get('score')
    total = result.get('totalQuestion')

    print('RES:', result)
    response = make_response(jsonify({'message': 'JSON received'}), 200)
    #return response
    return redirect( url_for('views.quiz_complete', score=score, total=total) )


