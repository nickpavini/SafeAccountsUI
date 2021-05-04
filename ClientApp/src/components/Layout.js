import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu/NavMenu';
import { SafeSideBar } from './SafeSideBar/SafeSideBar';

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        const RenderSafeSideBar = () => {
            if (this.props.device_mode == localStorage.getItem("MOBILE_MODE"))
                return <SafeSideBar device_mode={this.props.device_mode} SetSearchString={this.props.SetSearchString} Folders={this.props.folders} SetSelectedFolder={this.props.SetSelectedFolder} />
        }

        // include props from app.js to let navmenu know if it needed to update
        return (
            <div>
                {RenderSafeSideBar()}
                <NavMenu device_mode={this.props.device_mode} loggedIn={this.props.loggedIn} />
                <Container >
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
