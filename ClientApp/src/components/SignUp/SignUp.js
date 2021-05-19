import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom';

export class SignUp extends Component {
    static displayName = SignUp.name;

    constructor(props) {
        super(props);
        this.state = { signedUp: false, data: null, redirect: false };
        this.SignUp = this.SignUp.bind(this); // bind sign up function
    }

    componentDidMount() {
    }

    render() {
        // redirect upon login
        if (this.state.redirect)
            return (<Redirect to="/login" />);

        // just as a place holder we are displaying the sign up response
        if (this.state.signedUp)
            return (<p>{this.state.data}</p>);

        return (
            <div class="div_signup">
                <form id="form_signup" onSubmit={this.SignUp}>
                    <div class="container">
                        <label id="lbl_signup_firstname" htmlFor="text_input_signup_firstname"><b>First Name</b></label><br />
                        <input class="text_input_signup_name" type="text" placeholder="" id="text_input_signup_firstname" size="35" required></input>
                        <br />
                        <label id="lbl_signup_lastname" htmlFor="text_input_signup_lastname"><b>Last Name</b></label><br />
                        <input class="text_input_signup_name" type="text" placeholder="" id="text_input_signup_lastname" size="35" required></input>
                        <br />
                        <label id="lbl_signup_email" htmlFor="text_input_signup_email"><b>Email</b></label><br/>
                        <input type="email" placeholder="" id="text_input_signup_email" size="35" required></input>
                        <br />
                        <label id="lbl_signup_pass" htmlFor="text_input_signup_pass"><b>Password</b></label><br/>
                        <input type="password" placeholder="" id="text_input_signup_pass" size="35" required></input>
                        <br />
                        <button id="btn_signup" type="submit">Sign Up</button>
                    </div>
                </form>
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

        const response = await fetch('https://localhost:44366/users', requestOptions);
        const responseText = await response.text();
        this.setState({ data: responseText, signedUp: true })
        this.timeout = setTimeout(() => this.setState({ redirect: true }), 5000); // set redirect to true after 5 seconds
  }
}
