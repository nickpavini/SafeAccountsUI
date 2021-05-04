import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };

        // function bindings
        this.navbarLoggedOut = this.navbarLoggedOut.bind(this);
        this.navbarLoggedIn = this.navbarLoggedIn.bind(this);
    }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        var contents = !this.props.loggedIn
            ? this.navbarLoggedOut()
            : this.navbarLoggedIn();

        return contents;
    }

    // html for a basic navbar when logged out
    navbarLoggedOut() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <div class="div_navbar_items">
                        <NavbarBrand tag={Link} to="/">SafeAccountsUI</NavbarBrand>
                        <NavLink id="navlinks" tag={Link} className="text-dark" to="/login">Login</NavLink>
                        <NavLink id="navlinks" tag={Link} className="text-dark" to="/signup">Sign Up</NavLink>
                    </div>
                </Navbar>
            </header>
        );
    }

    // html for a basic navbar when loggedIn
    navbarLoggedIn() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <div class="div_navbar_items">
                        <NavbarBrand tag={Link} to="/">SafeAccountsUI</NavbarBrand>
                        <NavLink id="navlinks" tag={Link} className="text-dark" to="/account">Account</NavLink>
                    </div>
                </Navbar>
            </header>
        );
    }
}
