import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './EditSafeItem.css';

export class EditSafeItem extends Component {
    static displayName = EditSafeItem.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: false, redirect: false,
            titleDone: null, loginDone: null, passwordDone: null, // flags for if each individually is good
            descriptionDone: null, error: false // error flag to display message if needed
        }

        // function bindings
        this.SaveItemEdit = this.SaveItemEdit.bind(this);
        this.UpdateDescription = this.UpdateDescription.bind(this);
        this.UpdateLogin = this.UpdateLogin.bind(this);
        this.UpdatePassword = this.UpdatePassword.bind(this);
        this.UpdateDescription = this.UpdateDescription.bind(this);
        this.CallItemEditAPI = this.CallItemEditAPI.bind(this);
        this.CheckIfSaveFinished = this.CheckIfSaveFinished.bind(this);
    }

    render() {
        // check if loading
        if (this.state.loading)
            return <p>saving...</p>;

        // when ready to switch paths
        else if (this.state.redirect)
            return <Redirect to="/dashboard" />;


        // viewing a single account as a whole page in edit mode
        return (
            <div className="div_edit_safe_item">
                <form id="form_edit_safe_item" onSubmit={this.SaveItemEdit}>
                    <div className="container">
                        <label id="lbl_edit_item_title" htmlFor="text_input_edit_item_title"><b>Title</b></label><br />
                        <textarea className="text_input_edit_item" placeholder="" id="text_input_edit_item_title" rows="1" cols="38" defaultValue={this.props.info.title} required></textarea>
                        <br />
                        <label id="lbl_edit_item_login" htmlFor="text_input_edit_item_login"><b>Login</b></label><br />
                        <textarea className="text_input_edit_item" placeholder="" id="text_input_edit_item_login" rows="1" cols="38" defaultValue={this.props.info.login} required></textarea>
                        <br />
                        <label id="lbl_edit_item_password" htmlFor="text_input_edit_item_password"><b>Password</b></label><br />
                        <textarea className="text_input_edit_item" placeholder="" id="text_input_edit_item_password" rows="1" cols="38" defaultValue={this.props.info.password} required></textarea>
                        <br />
                        <label id="lbl_edit_item_description" htmlFor="text_input_edit_item_description"><b>Description</b></label><br />
                        <textarea className="text_input_edit_item" placeholder="" id="text_input_edit_item_description" rows="4" cols="38" defaultValue={this.props.info.description} required></textarea>
                        <br />
                        <button id="btn_save_edit" type="submit"><b>Save</b></button>
                    </div>
                </form>
            </div>
        );
    }

    async SaveItemEdit(event) {
        event.preventDefault(); //prevent page refresh

        // get the values in the text fields
        var title = event.target.text_input_edit_item_title.value;
        var login = event.target.text_input_edit_item_login.value;
        var password = event.target.text_input_edit_item_password.value;
        var description = event.target.text_input_edit_item_description.value;

        // update values as needed
        this.setState({ loading: true });
        (title !== this.props.info.title) ? this.UpdateTitle(title) : this.setState({ titleDone: true });
        (login !== this.props.info.login) ? this.UpdateLogin(login) : this.setState({ loginDone: true });
        (password !== this.props.info.password) ? this.UpdatePassword(password) : this.setState({ passwordDone: true });
        (description !== this.props.info.description) ? this.UpdateDescription(description) : this.setState({ descriptionDone: true });
    }

    async UpdateTitle(value) {
        var response = await this.CallItemEditAPI("/title", value);
        if (response.ok) {
            this.setState({ titleDone: true });
            this.CheckIfSaveFinished();
        }
        else {
            this.setState({ titleDone: true, error: true, loading: false });
        }
    }

    async UpdateLogin(value) {
        var response = await this.CallItemEditAPI("/login", value);
        if (response.ok) {
            this.setState({ loginDone: true });
            this.CheckIfSaveFinished();
        }
        else {
            this.setState({ loginDone: true, error: true, loading: false });
        }
    }

    async UpdatePassword(value) {
        var response = await this.CallItemEditAPI("/password", value);
        if (response.ok) {
            this.setState({ passwordDone: true });
            this.CheckIfSaveFinished();
        }
        else {
            this.setState({ passwordDone: true, error: true, loading: false });
        }
    }

    async UpdateDescription(value) {
        var response = await this.CallItemEditAPI("/description", value);
        if (response.ok) {
            this.setState({ descriptionDone: true });
            this.CheckIfSaveFinished();
        }
        else {
            this.setState({ descriptionDone: true, error: true, loading: false });
        }
    }

    async CallItemEditAPI(endpoint, new_value) {
        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: "\"" + new_value + "\"",
            credentials: 'include'
        };

        //make request and get response
        var reqUrl = 'https://localhost:44366/users/' + this.props.uid + '/accounts/' + this.props.info.id + endpoint
        return fetch(reqUrl, requestOptions);
    }

    // function to check if all the saving has finished
    async CheckIfSaveFinished() {
        if (this.state.titleDone && this.state.loginDone && this.state.passwordDone && this.state.descriptionDone) {
            await this.props.FetchSafe(); //update safe for dashboard.. could probably code this to be much faster than another call
            this.setState({ loading: false, redirect: true }); // done loading, lets get back to dashboard
        }
    }
}