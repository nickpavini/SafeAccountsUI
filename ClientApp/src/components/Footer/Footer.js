import React, { Component } from 'react';
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Footer.css';

export class Footer extends Component {

    constructor(props) {
        super(props);

        // function bindings
        this.footerLoggedOut = this.footerLoggedOut.bind(this);
        this.footerLoggedOutMobile = this.footerLoggedOutMobile.bind(this);
        this.footerLoggedOutDesktop = this.footerLoggedOutDesktop.bind(this);
        this.footerLoggedIn = this.footerLoggedIn.bind(this);
        this.footerLoggedInMobile = this.footerLoggedInMobile.bind(this);
        this.footerLoggedInDesktop = this.footerLoggedInDesktop.bind(this);

    }

    render() {
        var contents = !this.props.loggedIn
            ? this.footerLoggedOut()
            : this.footerLoggedIn();

        return contents;
    }

    footerLoggedOut() {
        var contents = this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE")
            ? this.footerLoggedOutDesktop()
            : this.footerLoggedOutMobile();

        return contents;
    }

    footerLoggedOutDesktop() {
        return (
            <div className="div_footer" style={{ height: this.props.height }} >
                <div id="div_copyright"><FontAwesomeIcon icon={faCopyright} /><span id="span_copyright">2021 Safe Accounts</span></div>
            </div >
        );
    }

    footerLoggedOutMobile() {
        return (
            <div className="div_footer" style={{ height: this.props.height }} >
                <div id="div_copyright"><FontAwesomeIcon icon={faCopyright} /><span id="span_copyright">2021 Safe Accounts</span></div>
            </div >
        );
    }

    footerLoggedIn() {
        var contents = this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE")
            ? this.footerLoggedInDesktop()
            : this.footerLoggedInMobile();

        return contents;
    }

    footerLoggedInDesktop() {
        return (
            <div className="div_footer" style={{ height: this.props.height }} >
                <div id="div_copyright"><FontAwesomeIcon icon={faCopyright} /><span id="span_copyright">2021 Safe Accounts</span></div>
            </div >
        );
    }

    footerLoggedInMobile() {
        return (
            <div className="div_footer" style={{ height: this.props.height }} >
                <div id="div_copyright"><FontAwesomeIcon icon={faCopyright} /><span id="span_copyright">2021 Safe Accounts</span></div>
            </div >
        );
    }
}
