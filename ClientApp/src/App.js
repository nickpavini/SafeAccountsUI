import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home/Home';
import { SignUp } from './components/SignUp/SignUp';
import { Login } from './components/Login/Login';
import { DashBoard } from './components/DashBoard/DashBoard';
import { Account } from './components/Account/Account';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { loading: true, loggedIn: false, uid: null };

        //function bindings
        this.attemptRefresh = this.attemptRefresh.bind(this);
        this.updateUserLoggedIn = this.updateUserLoggedIn.bind(this);
    }

    componentDidMount() {
        this.attemptRefresh();
    }

    render() {
        var contents = null;

        // check to see if we are waiting on a response from the api
        if (this.state.loading) {
            contents = <p>Loading...</p>;
        }
        else {
            // set path options based on whether or not the user is logged in
            contents = (
                <Layout loggedIn={this.state.loggedIn} >
                    <Route exact path='/' render={() => (
                        this.state.loggedIn ? (
                            <Redirect to="/dashboard" />
                        ) : (
                                <Home />
                            )
                    )} />
                    <Route path='/login' render={() => (
                        this.state.loggedIn ? (
                            <Redirect to="/dashboard" />
                        ) : (
                                <Login updateUserLoggedIn={this.updateUserLoggedIn} />
                            )
                    )} />
                    <Route path='/signup' render={() => (
                        this.state.loggedIn ? (
                            <Redirect to="/dashboard" />
                        ) : (
                                <SignUp />
                            )
                    )} />
                    <Route path='/dashboard' render={() => (
                        this.state.loggedIn ? (
                            <DashBoard uid={this.state.uid} />
                        ) : (
                                <Redirect to="/login" />
                            )
                    )} />
                    <Route path='/account' render={() => (
                        this.state.loggedIn ? (
                            <Account uid={this.state.uid}/>
                        ) : (
                                <Redirect to="/login" />
                            )
                    )} />
                </Layout>
            );
        }

        return (contents);
    }

    // call back function for app to set user logged in
    updateUserLoggedIn(uidStr) {
        this.setState({ loggedIn: true, uid: uidStr });
    }

    // call back function for app to set user logged out
    updateUserLoggedOut() {
        this.setState({ loggedIn: false, uid: null });
    }

    // attemp to retrieve a new access token with the existing cookies.. Note that cookies are http only and contain JWT tokens and refresh tokens
    async attemptRefresh() {

        // http request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        // make a call to the refresh and if the result is ok, then we are logged in
        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/refresh';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var obj = JSON.parse(responseText);
            this.setState({ loggedIn: true, uid: obj.id });
        }

        this.setState({ loading: false });
    }
}
