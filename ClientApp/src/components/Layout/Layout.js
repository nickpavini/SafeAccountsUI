import React, { Component } from 'react';
import { NavMenu } from '../NavMenu/NavMenu';
import { NavbarAccountMenu } from '../NavbarAccountMenu/NavbarAccountMenu';
import { Footer } from '../Footer/Footer';
import { ImportExportMenu } from '../DashBoard/Safe/ImportExportMenu/ImportExportMenu';
import './Layout.css'

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        const RenderNavbarAccountMenu = () => {
            if (this.props.AppState.openNavbarAccountMenu)
                return <NavbarAccountMenu SetAppState={this.props.SetAppState} />;
        }

        // set heights for the top bar, bottom bar, and middle content based on mode
        // this prevents the footer from being able to overlap the content in the middle when both use position fixed.
        // I.e. The middle container will always be exactly the height it needs to be
        var navbarHeight = 50, footerHeight = 55, middleHeight = this.props.AppState.windowDimensions.height - navbarHeight - footerHeight;

        // include props from app.js to let navmenu know if it needed to update
        return (
            <div>
                <ImportExportMenu
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                />
                <NavMenu
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                    height={navbarHeight.toString() + "px"}
                />
                {RenderNavbarAccountMenu()}
                <div className="div_main_container" style={{ height: middleHeight.toString() + "px"}}>
                    {this.props.children}
                </div>
                <Footer
                    AppState={this.props.AppState}
                    height={footerHeight.toString() + "px"}
                />
            </div>
        );
    }
}
