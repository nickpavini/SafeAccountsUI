import React, { Component } from 'react';
import './Login.css';

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);
        this.state = { rememberMe: false };

        // function bindings
        this.OnChangeRemeberMe = this.OnChangeRemeberMe.bind(this);
        this.Login = this.Login.bind(this);
    }

    render() {
        return (
            <div class="div_login">
                <form id="form_login" onSubmit={this.Login}>
                    <div class="container">
                        <label id="lbl_login_email" htmlFor="text_input_login_email"><b>Email</b></label><br />
                        <input class="text_input_login_email" type="text" placeholder="" id="text_input_login_email" size="35" required></input>
                        <br />
                        <label id="lbl_login_password" htmlFor="text_input_login_password"><b>Password</b></label><br />
                        <input class="text_input_login_password" type="password" placeholder="" id="text_input_login_password" size="35" required></input>
                        <br />
                        <div class="div_login_buttons">
                            <input type="checkbox" defaultChecked={false} onClick={this.OnChangeRemeberMe} id="input_chk_login_remember"></input>
                            <label id="lbl-login-remember">Remember me</label>
                            <button id="btn_login" type="submit">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // update the remeber me flag.. still need to implement credential saving with this
    OnChangeRemeberMe() {
        this.setState({ rememberMe: !this.state.rememberMe })
    }

    // function to attempt login and cookie retrieval
    async Login(event) {
        event.preventDefault(); //prevent page refresh
        var email = event.target.text_input_login_email.value;
        var password = event.target.text_input_login_password.value;

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password}),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/login', requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var obj = JSON.parse(responseText);

            // update and cause re-render
            this.props.updateUserLoggedIn(obj.id);
        }
    }
}
