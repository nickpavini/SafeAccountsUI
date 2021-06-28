import React, { Component } from 'react';
import './SafeItemContextMenu.css';
import { Redirect } from 'react-router-dom';

export class SafeItemContextMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, toUrl: null
        }

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.AddItem = this.AddItem.bind(this);
        this.EditSafeItem = this.EditSafeItem.bind(this);
        this.DeleteSafeItem = this.DeleteSafeItem.bind(this);
        this.CopyItemPassword = this.CopyItemPassword.bind(this);
        this.CopyItemUsername = this.CopyItemUsername.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    // unrender if we click away
    async handleClick(e) {
        this.props.CloseContextMenu();
    }

    render() {
        // redirect if needed
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />

        // menu options
        return (
            <div id="menu_safeitem" style={{ top: this.props.top, left: this.props.left }}>
                <span className="menu_safeitem" id="menu_safeitem_add_item" onClick={this.AddItem}>Add Item</span><br />
                <span className="menu_safeitem" id="menu_safeitem_edit_item" onClick={this.EditSafeItem}>Edit Item</span><br />
                <span className="menu_safeitem" id="menu_safeitem_delete_item" onClick={this.DeleteSafeItem}>Delete Item</span><br />
                <span className="menu_safeitem" id="menu_safeitem_copy_username" onClick={this.CopyItemUsername}>Copy Username</span><br />
                <span className="menu_safeitem" id="menu_safeitem_copy_password" onClick={this.CopyItemPassword}>Copy Password</span><br />
            </div>
        );
    }

    // redirect to page for adding an item to the safe
    AddItem() {
        this.setState({ redirect: true, toUrl: '/safeitems/add' })
    }

    // set redirect and go to safeitems path and render in edit mode
    EditSafeItem() {
        this.setState({ redirect: true, toUrl: "/safeitems/" + this.props.item.id.toString() });
    }

    // POST a new item to the safe
    async DeleteSafeItem() {
        // HTTP request options
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.uid + '/accounts/' + this.props.item.id.toString(), requestOptions);
        if (response.ok) {
            this.props.FetchSafe();
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.DeleteSafeItem(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            
        }
    }

    // copies password to the clipboard
    CopyItemUsername() {
        navigator.clipboard.writeText(this.props.item.login);
    }

    // copies password to the clipboard
    CopyItemPassword() {
        navigator.clipboard.writeText(this.props.item.password);
    }
}
