import React, { Component } from 'react';
import './Account.css';

export class Account extends Component {
    render() {
        var contents = null;

        // send props to safe and sidebar that are controlled by dashboard and re-render components as needed
        contents = (
            <p>{this.props.AppState.account_info}</p>
        );

        return contents;
    }
}
