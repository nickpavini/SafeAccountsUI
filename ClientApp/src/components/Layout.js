import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu/NavMenu';

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        // include props from app.js to let navmenu know if it needed to update
        return (
            <div>
                <NavMenu loggedIn={this.props.loggedIn} />
                <Container >
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
