import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './AddSafeItem.css';

export class AddSafeItem extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, loading: false };

        // function bindings
        this.AddSafeItem = this.AddSafeItem.bind(this);
    }

    render() {
        // check for redirection
        var contents = this.state.redirect
            ? < Redirect to="/dashboard" />
            : this.state.loading
                ? <p>loading...</p>
                : (
                    <div className="div_add_safe_item">
                        <form id="form_add_safe_item" onSubmit={this.AddSafeItem}>
                            <div className="container">
                                <label id="lbl_safe_item_title" htmlFor="text_input_safe_item_title"><b>Title</b></label><br />
                                <textarea className="text_input_safe_item" placeholder="" id="text_input_safe_item_title" rows="1" cols="38" required></textarea>
                                <br />
                                <label id="lbl_safe_item_login" htmlFor="text_input_safe_item_login"><b>Login</b></label><br />
                                <textarea className="text_input_safe_item" placeholder="" id="text_input_safe_item_login" rows="1" cols="38" required></textarea>
                                <br />
                                <label id="lbl_safe_item_password" htmlFor="text_input_safe_item_password"><b>Password</b></label><br />
                                <textarea className="text_input_safe_item" placeholder="" id="text_input_safe_item_password" rows="1" cols="38" required></textarea>
                                <br />
                                <label id="lbl_safe_item_description" htmlFor="text_input_safe_item_description"><b>Description</b></label><br />
                                <textarea className="text_input_safe_item" placeholder="" id="text_input_safe_item_description" rows="4" cols="38" required></textarea>
                                <br />
                                <button id="btn_add_safe_item" type="submit"><b>Store in Safe</b></button>
                            </div>
                        </form>
                    </div>
                );

        return contents;
    }

    // POST a new item to the safe
    async AddSafeItem(event) {
        event.preventDefault(); //prevent page refresh
        this.setState({ loading: true }); // loading as we process request

        var title = event.target.text_input_safe_item_title.value;
        var login = event.target.text_input_safe_item_login.value;
        var password = event.target.text_input_safe_item_password.value;
        var description = event.target.text_input_safe_item_description.value;

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify({ title: title, login: login, password: password, description: description }),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/' + this.props.uid + '/accounts', requestOptions);
        if (response.ok) {
            await this.props.FetchSafe();
            setTimeout(() => this.setState({ redirect: true }), 4000)
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.AddSafeItem(event); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
