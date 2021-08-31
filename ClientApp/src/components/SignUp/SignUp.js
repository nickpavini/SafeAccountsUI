import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom';

export class SignUp extends Component {
    static displayName = SignUp.name;

    constructor(props) {
        super(props);
        this.state = {
            signedUp: false,
            error: false, errorMessage: null
        };
        this.SignUp = this.SignUp.bind(this); // bind sign up function
    }

    render() {
        // just as a place holder we are displaying the sign up response
        if (this.state.signedUp)
            return (
                <div className="div_signup_container">
                    <div id="div_signup_success">
                        <h3>Signup Successful!</h3>
                        <p>Check your email for a verification link.</p>
                    </div>
                </div>
            );

        return (
            <div className="div_signup_container">
                <div className="div_signup">
                    <div id="div_signup_welcome">
                        <label id="lbl_signup_welcome">Create Account!</label>
                        <p id="p_signup_welcome_message">"Security used to be an inconvenience sometimes, but now it's a necessity all the time." - Martina Navratilova</p>
                    </div>
                    <form id="form_signup" onSubmit={this.SignUp}>
                        <div id="div_signup_container">
                            <input className="text_input_signup" type="text" placeholder="First Name" id="text_input_signup_firstname" size="35" required></input>
                            <br />
                            <input className="text_input_signup" type="text" placeholder="Last Name" id="text_input_signup_lastname" size="35" required></input>
                            <br />
                            <input className="text_input_signup" type="email" placeholder="Email" id="text_input_signup_email" size="35" required></input>
                            <br />
                            <input className="text_input_signup" type="password" placeholder="Password" id="text_input_signup_pass" size="35" required></input>
                            <br />
                            <button id="btn_signup" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    //this is the function where we will call our api and attemp to register a user
    async SignUp(event) {
        event.preventDefault(); //prevent page refresh
        var firstname = event.target.text_input_signup_firstname.value;
        var lastname = event.target.text_input_signup_lastname.value;
        var email = event.target.text_input_signup_email.value;
        var password = event.target.text_input_signup_pass.value;

        // http request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstname, last_name: lastname, email: email, password: password }),
        };

        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users', requestOptions);
        if (response.ok) {
            // successful signup
            this.setState({ signedUp: true });
        }
        else {
            // capture the error message in state for displaying or handling
            const responseText = await response.text();
            this.setState({ error: true, errorMessage: responseText });
        }
    }
}
