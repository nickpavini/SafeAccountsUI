import React, { Component } from 'react';
import './Account.css';

export class Account extends Component {
    static displayName = Account.name;

    constructor(props) {
        super(props);
        this.state = { userInfo: null };

        // function bindings
        this.FetchUserInfo = this.FetchUserInfo.bind(this);
    }

    componentDidMount() {
        this.FetchUserInfo(); // get user Info
    }

    render() {
        var contents = null;

        // if any infor isnt done yet display loading for now
        if (this.state.userInfo === null) {
            contents = <p>Loading...</p>;
        }
        else {
            // send props to safe and sidebar that are controlled by dashboard and re-render components as needed
            contents = (
                <p>{this.state.userInfo}</p>
            );
        }
        return contents;
    }

    // get user account info for the settings area.. might move this out of dashboard eventually
    async FetchUserInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.props.uid;

        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ userInfo: responseText })
        }
    }
}
