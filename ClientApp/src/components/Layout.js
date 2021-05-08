import React, { Component } from 'react';
import { NavMenu } from './NavMenu/NavMenu';
import { Footer } from './Footer/Footer';
import './Layout.css'

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        // include props from app.js to let navmenu know if it needed to update
        return (
            <div>
                <NavMenu device_mode={this.props.device_mode} loggedIn={this.props.loggedIn} />
                <div class="div_main_container">
                    {this.props.children}
                </div>
                <Footer device_mode={this.props.device_mode} loggedIn={this.props.loggedIn} />
            </div>
        );
    }
}
