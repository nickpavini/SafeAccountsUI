import React, { Component } from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './PasswordReset.css';

export class PasswordReset extends Component {
    static displayName = PasswordReset.name;

    constructor(props) {
        super(props);
        var params = queryString.parse(window.location.search);

        // if no query string, then redirect to login.. we will want to add other checks also
        if (Object.keys(params).length === 0) {
            this.state = { loading: false, redirect: true };
        }
        else {
            // set state to bring up set password area
            this.state = {
                params: params, error_message: null, loading: false,
                redirect: false, resetSuccess: false
            };
        }

        //function bindings
        this.SetNewPassword = this.SetNewPassword.bind(this);
    }

    render() {
        var contents;

        if (this.state.loading) {
            contents = <p>loading</p>;
        }
        else if (this.state.redirect)
            contents = <Redirect to={'/login'} />;
        else if (this.state.resetSuccess) {
            contents = <p>Password set! Redirecting to login..</p>;
        }
        else {
            contents = (
                <div className="div_password_reset">
                    <div id="div_password_reset_header">
                        <label id="lbl_password_reset">Set Password</label>
                        <p id="p_welcome_message">Always choose a strong password to secure your safe!</p>
                    </div>
                    <form id="form_password_reset" onSubmit={this.SetNewPassword}>
                        <div id="login_container">
                            <input className="text_input_password_reset" type="password" placeholder="New Password" id="text_input_password_reset_new" size="35" required></input>
                            <br />
                            <input className="text_input_password_reset" type="password" onChange={this.PasswordConfirmationChanged} placeholder="Confirm Password" id="text_input_password_reset_confirm" size="35" required></input>
                            <br />
                            {this.state.passwordsMatch === false ? <div id="div_passwords_dont_match"><FontAwesomeIcon id="icon_passwords_dont_match" icon={faTimes} /><p>Passwords do not match</p></div> : null}
                            <button id="btn_password_reset" type="submit">Save Password</button>
                        </div>
                    </form>
                </div>
            );
        }

        return contents;
    }

    // api call to set the new password
    async SetNewPassword(event) {
        event.preventDefault(); //prevent page refresh
        var newPassword = event.target.text_input_password_reset_new.value;
        var newPasswordConfirmation = event.target.text_input_password_reset_confirm.value;

        // check if the passwords match
        if (newPassword !== newPasswordConfirmation) {
            this.setState({ passwordsMatch: false });
            return;
        }

        this.setState({ loading: true })

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: "\"" + newPassword + "\"",
            credentials: 'include'
        };

        //make request and get response
        var reqUrl = process.env.REACT_APP_WEBSITE_URL + '/users/password/reset/?email=' + this.state.params["email"] + '&token=' + this.state.params["token"];
        const response = await fetch(reqUrl, requestOptions);
        if (response.ok) {
            // done loading and email confirmed, set redirect a few seconds later
            this.setState({ resetSuccess: true, loading: false });
            setTimeout(() => this.setState({ redirect: true }), 4000)
        }
        // shouldnt ever be unauthorized because no tokens are needed for this call
        else {
        }
    }
}
