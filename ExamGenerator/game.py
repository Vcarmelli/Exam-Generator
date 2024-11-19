from flask import Blueprint, current_app, render_template, redirect, url_for, request, session, jsonify

game = Blueprint('game', __name__, url_prefix='/game')


@game.route('/')
def index():
    generated_questions = session.get('generated_questions', [])
    if not generated_questions:
        return redirect(url_for('views.selection', message="No generated questions available."))

    print('QUES FOR GAME:', generated_questions)
    for question_set in generated_questions:
        # if question_set['type'] == 'IDN':
        #     return redirect(url_for('game.identification'))
        # if question_set['type'] == 'MCQ':
        #     return redirect(url_for('game.multiple_choice'))
        if question_set['type'] == 'TOF':
            return redirect(url_for('game.true_or_false'))


@game.route('/identification')
def identification():
    generated_questions = session.get('generated_questions', {})
    idn_questions = [items for question_set in generated_questions if question_set['type'] == 'IDN' for items in question_set['questions']]
    return render_template('game/identification.html', game_mode='Identification', generated_questions=idn_questions)


@game.route('/multiple-choice')
def multiple_choice():
    generated_questions = session.get('generated_questions', {})
    mcq_questions = [items for question_set in generated_questions if question_set['type'] == 'MCQ' for items in question_set['questions']]
    return render_template('game/multiple-choice.html', game_mode='Multiple Choice', generated_questions=mcq_questions)


@game.route('/true-or-false')
def true_or_false():
    generated_questions = session.get('generated_questions', {})
    tof_questions = [items for question_set in generated_questions if question_set['type'] == 'TOF' for items in question_set['questions']]
    print("tof:", tof_questions)
    return render_template('game/true-or-false.html', game_mode='True or False', generated_questions=tof_questions)

