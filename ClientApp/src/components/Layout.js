import React, { Component } from 'react';
import { NavMenu } from './NavMenu/NavMenu';
import { NavbarAccountMenu } from './NavbarAccountMenu/NavbarAccountMenu';
import { Footer } from './Footer/Footer';
import './Layout.css'

export class Layout extends Component {
    static displayName = Layout.name;

    constructor(props) {
        super(props);

        // set to hold the ids of which items are currently selected
        this.state = {
            openNavbarAccountMenu: false
        };

        // function binding
        this.OpenNavbarAccountMenu = this.OpenNavbarAccountMenu.bind(this);
        this.CloseNavbarAccountMenu = this.CloseNavbarAccountMenu.bind(this);
    }

    render() {
        const RenderNavbarAccountMenu = () => {
            if (this.state.openNavbarAccountMenu)
                return <NavbarAccountMenu CloseNavbarAccountMenu={this.CloseNavbarAccountMenu} UpdateUserLoggedOut={this.props.UpdateUserLoggedOut} />;
        }

        // set heights for the top bar, bottom bar, and middle content based on mode
        // this prevents the footer from being able to overlap the content in the middle when both use position fixed.
        // I.e. The middle container will always be exactly the height it needs to be
        var navbarHeight = 55, footerHeight = 55, middleHeight = this.props.windowDimensions.height - navbarHeight - footerHeight;

        // include props from app.js to let navmenu know if it needed to update
        return (
            <div>
                <NavMenu device_mode={this.props.device_mode} loggedIn={this.props.loggedIn} OpenNavbarAccountMenu={this.OpenNavbarAccountMenu} height={navbarHeight.toString() + "px" } />
                {RenderNavbarAccountMenu()}
                <div className="div_main_container" style={{ height: middleHeight.toString() + "px"}}>
                    {this.props.children}
                </div>
                <Footer device_mode={this.props.device_mode} loggedIn={this.props.loggedIn} height={footerHeight.toString() + "px" }/>
            </div>
        );
    }

    async OpenNavbarAccountMenu() {
        this.setState({ openNavbarAccountMenu: true })
    }

    async CloseNavbarAccountMenu() {
        this.setState({ openNavbarAccountMenu: false });
    }
}
