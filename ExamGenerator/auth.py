from flask import Blueprint, flash, render_template, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db

auth = Blueprint('auth', __name__, url_prefix='/auth')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        fname = request.form.get('firstname')
        lname = request.form.get('lastname')
        pass1 = request.form.get('password1')
        pass2 = request.form.get('password2')

        print("Email:", email)
        print("First Name:", fname)
        print("Last Name:", lname)
        print("Password1:", pass1)
        print("Password2:", pass2)

        user = User.query.filter_by(email=email).first()
        print("user:", user)
        if user:
            flash('Account already exists.', category="error")
        elif pass1 != pass2:
            flash('Password does not match.', category="error")
        else:
            # add user to database
            new_user = User(
                email=email,
                first_name=fname, 
                last_name=lname, 
                password=generate_password_hash(pass1, method='pbkdf2:sha256')
            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Account created!', category='success')
            return redirect(url_for('views.dashboard'))
        
    return render_template('accounts/signup.html', user=current_user)  

        


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        print(f'email: {email} \npassword: {password}')

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.dashboard'))
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Email does not exist.', category='error')
            return render_template('accounts/login.html', user=current_user)

    return render_template('accounts/login.html', user=current_user)


@auth.route('/logout')
@login_required
def logout():
    logout_user() 
    return redirect(url_for('views.index'))
    


