﻿import React, { Component } from 'react';
import { Redirect } from 'react-router';
import queryString from 'query-string';
import './EmailChange.css';

export class EmailChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: null, error_message: null, loading: true,
            redirect: false, emailConfirmed: false
        };

        //function bindings
        this.ChangeEmail = this.ChangeEmail.bind(this);
    }

    componentDidMount() {
        var params = queryString.parse(window.location.search);
        this.ChangeEmail(params["token"])
    }

    render() {
        var contents;

        if (this.state.loading) {
            contents = <p>loading</p>;
        }
        else if (this.state.redirect)
            contents = <Redirect to="/login" />;
        else if (this.state.emailConfirmed) {
            contents = <p>Email Changed! Redirecting to dashboard..</p>;
        }
        else {
            contents = <p>Error confirming email change. {this.state.error_message}</p>;
        }

        return contents;
    }

    // function to attempt login and cookie retrieval
    async ChangeEmail(token) {

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_API_KEY,
                'AccessToken': window.localStorage.getItem("AccessToken")
            }
        };

        //make request and get response
        var reqString = process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/email/?token=' + token;
        const response = await fetch(reqString, requestOptions);
        if (response.ok) {
            // update acc info internally
            var acc_info = this.state.account_info;
            acc_info.email = queryString.parse(window.location.search)["email"]
            this.props.SetAppState({ account_info: acc_info })

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
