import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { UpdateUserLoggedOut } from '../HelperFunctions.js'
import './NavbarAccountMenu.css';

export class NavbarAccountMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, isFirstRender: true
        };

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.ViewAccount = this.ViewAccount.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    render() {
        // redirect if needed
        if (this.state.redirect)
            return <Redirect to='/account' />

        // menu options
        return (
            <div id="menu_navbar_account" >
                <span className="menu_navbar_account" id="menu_navbar_account_my_account" onClick={this.ViewAccount}>Account</span><br />
                <span className="menu_navbar_account" id="menu_navbar_account_sign_out" onClick={() => UpdateUserLoggedOut(this.props.SetAppState)}>Sign Out</span><br />
            </div>
        );
    }

    // unrender if we click away
    async handleClick(e) {
        // dont close if the icon was clicked.. this menu is getting closed up first open
        if (this.state.isFirstRender) {
            this.setState({isFirstRender: false});
            return;
        }

        this.props.CloseNavbarAccountMenu();
    }

    ViewAccount() {
        this.setState({ redirect: true });
    }
}
