from flask import Blueprint, render_template, redirect, url_for, request

game = Blueprint('game', __name__, url_prefix='/game')

@game.route('/')
def index():
    question_type = request.args.get('ques_type')

    if question_type == 'identification':
        return redirect(url_for('game.identification'))
    elif question_type == 'multiple_choice':
        return redirect(url_for('game.multiple_choice'))
    elif question_type == 'true_false':
        return redirect(url_for('game.true_or_false'))
    else:
        return redirect(request.url)


@game.route('/identification')
def identification():
    return render_template('game/identification.html', game_mode='Identification')

@game.route('/multiple-choice')
def multiple_choice():
    return render_template('game/multiple-choice.html', game_mode='Multiple Choice')

@game.route('/true-or-false')
def true_or_false():
    return render_template('game/true-or-false.html', game_mode='True or False')
