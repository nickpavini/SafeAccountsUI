import React, { Component } from 'react';
import sjcl from "sjcl";
import './Login.css';

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);
        this.state = { rememberMe: false, loading: false, errorMessage: null };

        // function bindings
        this.OnChangeRemeberMe = this.OnChangeRemeberMe.bind(this);
        this.Login = this.Login.bind(this);
    }

    render() {
        if (this.state.loading)
            return (
                <div className="div_login_container">
                    <div class="loader"></div>
                </div>
                );

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
                            {this.state.errorMessage && <p className='error_message'>{this.state.errorMessage}</p>}
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
        this.setState({ loading: true });

        event.preventDefault(); //prevent page refresh
        var email = event.target.text_input_login_email.value;
        var password = event.target.text_input_login_password.value;

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password})
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/login', requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var loginRes = JSON.parse(responseText);

            /*
             * Here we will hash the pwd and store it in localStorage
             */
            var hashArr = sjcl.hash.sha256.hash(password);
            var hashHex = sjcl.codec.hex.fromBits(hashArr);
            window.localStorage.setItem("UserKey", hashHex);
            window.localStorage.setItem("AccessToken", loginRes.accessToken);
            window.localStorage.setItem("RefreshToken", loginRes.refreshToken.token);

            // update and cause re-render
            this.props.UpdateUserLoggedIn(loginRes.id);
        }
        else {
            this.setState({errorMessage: "Invalid email or password"})
        }

        this.setState({ loading: false });
    }
}
