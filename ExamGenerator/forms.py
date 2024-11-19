from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, HiddenField
from wtforms.validators import DataRequired, Email, Length, EqualTo

class SignupForm(FlaskForm):
    email = StringField(
        'Email Address',
        validators=[
            DataRequired(message="Email is required"),
            Email(message="Enter a valid email address"),
            Length(max=32)
        ]
    )
    password = PasswordField(
        'Password',
        validators=[
            DataRequired(message="Password is required"),
            Length(min=6, max=32, message="Password must be between 6 and 150 characters")
        ]
    )
    confirm_password = PasswordField(
        'Confirm Password',
        validators=[
            DataRequired(message="Please confirm your password"),
            EqualTo('password', message="Passwords must match")
        ]
    )
    first_name = StringField(
        'First Name',
        validators=[
            DataRequired(message="First name is required"),
            Length(max=32)
        ]
    )
    last_name = StringField(
        'Last Name',
        validators=[
            DataRequired(message="Last name is required"),
            Length(max=32)
        ]
    )
    account_type = HiddenField('Account Type')

    submit = SubmitField('Register')


class LoginForm(FlaskForm):
    email = StringField(
        'Email Address',
        validators=[
            DataRequired(message="Email is required"),
            Email(message="Enter a valid email address"),
        ]
    )
    password = PasswordField(
        'Password',
        validators=[DataRequired(message="Password is required")]
    )
    submit = SubmitField('Login')
