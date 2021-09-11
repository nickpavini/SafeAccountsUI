import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Encrypt, AttempRefresh, UpdateSafeItem, PostSafeItem } from '../HelperFunctions.js'
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
            ? < Redirect to="/dashboard"/>
            : <div className="div_modify_safe_item">
                <label
                    id="lbl_add_edit_item">{this.props.info !== undefined ? "Edit Safe Item" : "Add Safe Item"}</label>
                <form id="form_modify_safe_item"
                      onSubmit={this.props.info === undefined ? this.AddSafeItem : this.EditSafeItem}>
                    <div className="container">
                            <textarea className="text_input_safe_item" placeholder="Title"
                                      id="text_input_safe_item_title" rows="1" cols="38"
                                      defaultValue={this.props.info !== undefined ? this.props.info.title : ""}></textarea>
                        <br/>
                        <textarea className="text_input_safe_item" placeholder="Username"
                                  id="text_input_safe_item_login" rows="1" cols="38"
                                  defaultValue={this.props.info !== undefined ? this.props.info.login : ""}></textarea>
                        <br/>
                        <textarea className="text_input_safe_item" placeholder="Password"
                                  id="text_input_safe_item_password" rows="1" cols="38"
                                  defaultValue={this.props.info !== undefined ? this.props.info.password : ""}
                                  required></textarea>
                        <br/>
                        <textarea className="text_input_safe_item" placeholder="Url" id="text_input_safe_item_url"
                                  rows="1" cols="38"
                                  defaultValue={this.props.info !== undefined ? this.props.info.url : ""}></textarea>
                        <br/>
                        <textarea className="text_input_safe_item" placeholder="Description..."
                                  id="text_input_safe_item_description" rows="4" cols="38"
                                  defaultValue={this.props.info !== undefined ? this.props.info.description : ""}></textarea>
                        <br/>
                        <button id="btn_modify_safe_item" type="submit">
                            <b>{this.state.loading ? "Saving" : "Save"}</b>
                        </button>
                        <button id="btn_cancel" type="button" onClick={() => this.setState({redirect: true})}>
                            <b>Cancel</b>
                        </button>
                    </div>
                </form>
            </div>

        return contents;
    }

    // POST a new item to the safe
    async AddSafeItem(event) {
        event.preventDefault(); //prevent page refresh
        this.setState({ loading: true }); // loading as we process request

        // get values and encrypt
        var item = {
            title: Encrypt(event.target.text_input_safe_item_title.value),
            login: Encrypt(event.target.text_input_safe_item_login.value),
            password: Encrypt(event.target.text_input_safe_item_password.value),
            url: Encrypt(event.target.text_input_safe_item_url.value),
            description: Encrypt(event.target.text_input_safe_item_description.value),
            folderID: null
        }

        var retItem = await PostSafeItem(item, this.props.AppState);
        if (retItem !== -1) {
            // set unencrypted values now so that we can update the internal running safe
            retItem.title = event.target.text_input_safe_item_title.value;
            retItem.login = event.target.text_input_safe_item_login.value;
            retItem.password = event.target.text_input_safe_item_password.value;
            retItem.url = event.target.text_input_safe_item_url.value;
            retItem.description = event.target.text_input_safe_item_description.value;

            // update the apps internal safe and redirect in a few seconds
            UpdateSafeItem(retItem, this.props.AppState.safe, this.props.SetAppState);
            setTimeout(() => this.setState({ redirect: true }), 4000);
        }
    }

    async EditSafeItem(event) {
        event.preventDefault(); //prevent page refresh
        this.setState({ loading: true }); // loading as we process request

        // get values and encrypt
        var titleEncrypted = Encrypt(event.target.text_input_safe_item_title.value);
        var loginEncrypted = Encrypt(event.target.text_input_safe_item_login.value);
        var passwordEncrypted = Encrypt(event.target.text_input_safe_item_password.value);
        var urlEncrypted = Encrypt(event.target.text_input_safe_item_url.value);
        var descriptionEncrypted = Encrypt(event.target.text_input_safe_item_description.value);

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_API_KEY,
                'AccessToken': window.localStorage.getItem("AccessToken")
            },
            body: JSON.stringify({
                title: titleEncrypted,
                login: loginEncrypted,
                password: passwordEncrypted,
                url: urlEncrypted,
                description: descriptionEncrypted
            })
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/accounts/' + this.props.info.id, requestOptions);
        if (response.ok) {
            // get new account with id, then set data to decrypted values internally
            var acc = JSON.parse(await response.text());
            acc.title = event.target.text_input_safe_item_title.value;
            acc.login = event.target.text_input_safe_item_login.value;
            acc.password = event.target.text_input_safe_item_password.value;
            acc.url = event.target.text_input_safe_item_url.value;
            acc.description = event.target.text_input_safe_item_description.value;

            // update the apps internal safe and redirect in a few seconds
            UpdateSafeItem(acc, this.props.AppState.safe, this.props.SetAppState);
            setTimeout(() => this.setState({ redirect: true }), 4000);
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.EditSafeItem(event); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
