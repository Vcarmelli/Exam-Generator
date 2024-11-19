from flask import Blueprint, flash, render_template, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from .forms import LoginForm, SignupForm
from . import db

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()

    # NOTE: Show validation message on each input 
    account_type = request.args.get('account_type')
    if account_type:
        form.account_type.data = account_type

    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user:
                flash('Account already exists.', category='error')
            else:
                # add user to database
                new_user = User(
                    email=form.email.data,
                    password=generate_password_hash(form.password.data, method='pbkdf2:sha256'),
                    first_name=form.first_name.data,
                    last_name=form.last_name.data,
                    account_type=form.account_type.data  
                )
                db.session.add(new_user)
                db.session.commit()
                login_user(new_user, remember=True)
                flash('Account created!', category='success')
                return redirect(url_for('views.dashboard'))
            
    return render_template('accounts/signup.html', user=current_user, form=form) 
        


@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user:
                if check_password_hash(user.password, form.password.data):
                    login_user(user)
                    flash('Logged in successfully!', category='success')
                    return redirect(url_for('views.dashboard'))
                else:
                    flash('Incorrect password, try again.', category='error')
            else:
                flash('Email does not exist.', category='error')
                
    return render_template('accounts/login.html', user=current_user, form=form)


@auth.route('/logout')
@login_required
def logout():
    logout_user() 
    return redirect(url_for('views.index'))
    


