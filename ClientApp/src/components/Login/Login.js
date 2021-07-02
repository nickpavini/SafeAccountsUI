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
            <div className="div_login_container">
                <div className="div_login">
                    <div id="div_login_welcome">
                        <label id="lbl_login_welcome">Welcome Back!</label>
                        <p id="p_welcome_message">"You are an essential ingredient in our ongoing effort to reduce Security Risk."<br />- Kirsten Manthorne</p>
                    </div>
                    <form id="form_login" onSubmit={this.Login}>
                        <div id="login_container">
                            <input className="text_input_login" type="text" placeholder="Email" id="text_input_login_email" size="35" required></input>
                            <br />
                            <input className="text_input_login" type="password" placeholder="Password" id="text_input_login_password" size="35" required></input>
                            <br />
                            <div className="div_login_buttons">
                                <input type="checkbox" defaultChecked={false} onClick={this.OnChangeRemeberMe} id="input_chk_login_remember"></input>
                                <label id="lbl-login-remember">Remember me</label>
                                <button id="btn_login" type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
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
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/login', requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var obj = JSON.parse(responseText);

            // update and cause re-render
            this.props.updateUserLoggedIn(obj.id);
        }
    }
}
