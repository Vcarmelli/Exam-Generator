from flask import Blueprint, render_template

game = Blueprint('game', __name__, url_prefix='/game')

@game.route('/identification')
def identification():
    return render_template('game/identification.html')

@game.route('/multiple-choice')
def multiple_choice():
    return render_template('game/multiple-choice.html')

@game.route('/true-or-false')
def true_or_false():
    return render_template('game/true-or-false.html')
