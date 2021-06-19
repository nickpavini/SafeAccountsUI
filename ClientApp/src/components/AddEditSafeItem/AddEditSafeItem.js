import React, { Component } from 'react';
import { Redirect } from 'react-router';
import './AddEditSafeItem.css';

export class AddEditSafeItem extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, loading: false };

        // function bindings
        this.AddSafeItem = this.AddSafeItem.bind(this);
        this.EditSafeItem = this.EditSafeItem.bind(this);
    }

    render() {
        // check for redirection
        var contents = this.state.redirect
            ? < Redirect to="/dashboard" />
            : this.state.loading
                ? <p>loading...</p>
                : (
                    <div className="div_modify_safe_item">
                        <form id="form_modify_safe_item" onSubmit={this.props.info === undefined ? this.AddSafeItem : this.EditSafeItem}>
                            <div className="container">
                                <textarea className="text_input_safe_item" placeholder="Title" id="text_input_safe_item_title" rows="1" cols="38" defaultValue={this.props.info !== undefined ? this.props.info.title : ""} ></textarea>
                                <br />
                                <textarea className="text_input_safe_item" placeholder="Username" id="text_input_safe_item_login" rows="1" cols="38" defaultValue={this.props.info !== undefined ? this.props.info.login : ""} ></textarea>
                                <br />
                                <textarea className="text_input_safe_item" placeholder="Password" id="text_input_safe_item_password" rows="1" cols="38" defaultValue={this.props.info !== undefined ? this.props.info.password : ""} required></textarea>
                                <br />
                                <textarea className="text_input_safe_item" placeholder="Url" id="text_input_safe_item_url" rows="1" cols="38" defaultValue={this.props.info !== undefined ? this.props.info.url : ""} ></textarea>
                                <br />
                                <textarea className="text_input_safe_item" placeholder="Description..." id="text_input_safe_item_description" rows="4" cols="38" defaultValue={this.props.info !== undefined ? this.props.info.description : ""} ></textarea>
                                <br />
                                <button id="btn_modify_safe_item" type="submit"><b>Save</b></button>
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
        var url = event.target.text_input_safe_item_url.value;
        var description = event.target.text_input_safe_item_description.value;

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify({ title: title, login: login, password: password, url: url, description: description }),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/' + this.props.uid + '/accounts', requestOptions);
        if (response.ok) {
            var acc = JSON.parse(await response.text());
            this.props.UpdateSafeItem(acc);
            setTimeout(() => this.setState({ redirect: true }), 4000);
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

    async EditSafeItem(event) {
        event.preventDefault(); //prevent page refresh
        this.setState({ loading: true }); // loading as we process request

        var title = event.target.text_input_safe_item_title.value;
        var login = event.target.text_input_safe_item_login.value;
        var password = event.target.text_input_safe_item_password.value;
        var url = event.target.text_input_safe_item_url.value;
        var description = event.target.text_input_safe_item_description.value;

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify({ title: title, login: login, password: password, url: url, description: description }),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/' + this.props.uid + '/accounts/' + this.props.info.id, requestOptions);
        if (response.ok) {
            var acc = JSON.parse(await response.text());
            this.props.UpdateSafeItem(acc);
            setTimeout(() => this.setState({ redirect: true }), 4000);
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.EditSafeItem(event); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
