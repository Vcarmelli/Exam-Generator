from flask import Blueprint, current_app, render_template, redirect, url_for, request, session, jsonify

game = Blueprint('game', __name__, url_prefix='/game')


@game.route('/')
def index():
    generated_questions = session.get('generated_questions', [])
    current_index = session.get('current_index', 0)
    
    if not generated_questions:
        return redirect(url_for('views.selection', message="No generated questions available."))
    
    if current_index >= len(generated_questions):
        return redirect(url_for('views.quiz_complete'))
    
    #print('QUES FOR GAME:', generated_questions)

    question_set = generated_questions[current_index]
    question_type = question_set['type']
    generated_questions = question_set.get('questions', '')

    template_map = {
        'IDN': 'game/identification.html',
        'MCQ': 'game/multiple-choice.html',
        'TOF': 'game/true-or-false.html',
    }
    template = template_map.get(question_type, 'index.html')
    
    return render_template(template, generated_questions=generated_questions)


@game.route('/next')
def next_question():
    current_index = session.get('current_index', 0)
    session['current_index'] = current_index + 1  # Increment index
    print("session['current_index']:", session['current_index'])
    return redirect(url_for('game.index'))

# @game.route('/identification')
# def identification():
#     generated_questions = session.get('generated_questions', {})
#     idn_questions = [items for question_set in generated_questions if question_set['type'] == 'IDN' for items in question_set['questions']]
#     return render_template('game/identification.html', generated_questions=idn_questions)


# @game.route('/multiple-choice')
# def multiple_choice():
#     generated_questions = session.get('generated_questions', {})
#     mcq_questions = [items for question_set in generated_questions if question_set['type'] == 'MCQ' for items in question_set['questions']]
#     return render_template('game/multiple-choice.html', generated_questions=mcq_questions)


# @game.route('/true-or-false')
# def true_or_false():
#     generated_questions = session.get('generated_questions', {})
#     tof_questions = [items for question_set in generated_questions if question_set['type'] == 'TOF' for items in question_set['questions']]
#     print("tof:", tof_questions)
#     return render_template('game/true-or-false.html', generated_questions=tof_questions)

