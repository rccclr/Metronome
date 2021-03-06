import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { register } from '../../actions';
import { Link } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import equals from 'validator/lib/equals';
import Error from '../Error/Error';


import './sign-up.css';

// Input Valiations match backend
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 56;
const EMAIL_MAX = 320;
const FNAME_MAX = 320;
const LNAME_MAX = 320;

class SignUp extends Component {
	handleFormSubmit = ({ email, password, firstName, lastName, role }) => {
	  this.props.register(email, password, firstName, lastName, role, this.props.history);
	};

	handleValidation = () => {
	  // Check all requirements are met and return if form is valid
	  const errors = {};
	  let formIsValid = true;

	  // First Name
	  if (!this.state.firstName) {
	    formIsValid = false;
	    errors.firstName = 'Cannot be empty';
	  }
	  if (this.state.firstName.length > FNAME_MAX) {
	    formIsValid = false;
	    errors.firstName = `Must be less than ${FNAME_MAX}`;
	  }
	  // Last Name
	  if (!this.state.lastName) {
	    formIsValid = false;
	    errors.lastName = 'Cannot be empty';
	  }
	  if (this.state.lastName.length > LNAME_MAX) {
	    formIsValid = false;
	    errors.lastName = `Must be less than ${LNAME_MAX}`;
	  }
	  // Email check
	  if (!isEmail(this.state.email)) {
	    formIsValid = false;
	    errors.email = 'Must be a valid email';
	  }

	  if (this.state.email.length > EMAIL_MAX) {
	    formIsValid = false;
	    errors.email = `Must be less than ${EMAIL_MAX} characters`;
	  }

	  // Password check if between values
	  if (
	    this.state.password.length < PASSWORD_MIN ||
			this.state.password.length > PASSWORD_MAX
	  ) {
	    formIsValid = false;
	    errors.password = 'Must be between 8 and 56 characters';
	  }

	  // Password confirmation check
	  if (!equals(this.state.password, this.state.confirmPassword)) {
	    formIsValid = false;
	    errors.passwordConfirm = 'Must match entered password';
	  }

	  this.setState({ errors });
	  return formIsValid;
	};

	render() {
	  return (

  <div id="about" className="container" style={{ marginTop: '-1%', width: '60%' }}>
    <div className="header-con text-center" >
      <div className="row">
        <div>
          <div className="icon-box">
            <div className="icon-box-content">
              <div className="content">
                <h2 className="title" style={{ marginLeft: '8%' }}>Welcome to Metronome</h2>
                <div className="form-container" style={{ marginTop: '-10%' }}>
                  <div className="signup-form">
                    <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)} style={{ width: '40%' }}>
                      <Error error={this.props.auth.error} />
                      <div>
                        <Field name="role" component="select" style={{ width: '100%' }}>
                          <option>Please select role</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Student">Student</option>
                        </Field>

                      </div>
                      <div className="pair">
                        <Field
                          name="firstName"
                          type="text"
                          component="input"
                          placeholder="First Name"
                          autoComplete="off"
                        />
                        <br />
                      </div>
                      <div className="pair">
                        <Field
                          name="lastName"
                          placeholder="Last Name"
                          component="input"
                          type="text"
                          autoComplete="off"
                        />
                        <br />
                      </div>
                      <div className="pair">
                        <Field
                          name="email"
                          placeholder="email"
                          type="email"
                          component="input"
                          autoComplete="off"
                        />
                        <br />
                      </div>
                      <div className="pair">
                        <Field
                          name="password"
                          type="password"
                          placeholder="password"
                          component="input"
                          autoComplete="off"
                        />
                        <br />
                      </div>
                      <div className="pair">
                        <Field
                          name="confirmPassword"
                          type="password"
                          placeholder="confirm password"
                          component="input"
                          autoComplete="off"
                        />
                        <br />
                      </div>
                      <input
                        style={{ fontSize: '14px', width: '100%' }}
                        type="submit"
                        value="Sign Up"
                      />
                      <br />
                      <Link className="link" to="/login">Already have an account?</Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

	  );
	}
}

const mapStateToProps = state => ({
  auth: state.auth,
});

SignUp = connect(mapStateToProps, { register })(SignUp);

export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'firstName', 'lastName', 'role'],
})(SignUp);
