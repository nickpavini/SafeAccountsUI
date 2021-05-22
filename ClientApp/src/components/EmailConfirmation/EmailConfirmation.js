import React, { Component } from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import './EmailConfirmation.css';

export class EmailConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: null, error_message: null, loading: true,
            redirect: false, emailConfirmed: false
        };

        //function bindings
        this.ConfirmEmail = this.ConfirmEmail.bind(this);
    }

    componentDidMount() {
        var params = queryString.parse(window.location.search);
        this.ConfirmEmail(params["token"], params["email"])
    }

    render() {
        var contents;

        if (this.state.loading) {
            contents = <p>loading</p>;
        }
        else if (this.state.redirect)
            contents = <Redirect to="/login" />;
        else if (this.state.emailConfirmed) {
            contents = <p>Email Confirmed! Redirecting to login..</p>;
        }
        else {
            contents = <p>Error confirming email. {this.state.error_message}</p>;
        }

        return contents;
    }

    // function to attempt login and cookie retrieval
    async ConfirmEmail(token, email) {

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        //make request and get response
        var reqString = 'https://localhost:44366/users/confirm/?token=' + token + '&email=' + email;
        const response = await fetch(reqString, requestOptions);
        if (response.ok) {
            // done loading and email confirmed, set redirect a few seconds later
            this.setState({ emailConfirmed: true, loading: false });
            setTimeout(() => this.setState({ redirect: true }), 4000)
        }
        else {
            const responseText = await response.text();
            this.setState({ loading: false, error_message: responseText }); // done loading but email not confirmed
        }
    }
}
