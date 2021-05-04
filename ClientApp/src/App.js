import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router';
import { Layout } from './components/Layout.js';
import { Home } from './components/Home/Home';
import { SignUp } from './components/SignUp/SignUp';
import { Login } from './components/Login/Login';
import { DashBoard } from './components/DashBoard/DashBoard.js';
import { Account } from './components/Account/Account';

import './custom.css'

// hook for returning device mode based on width
const useViewport = () => {
    const [width, setWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    // these numbers will likely change
    var mode;
    if (width < 700)
        mode = 0; // mobile
    else
        mode = 1; // desktop

    return mode;
}

// layer the app with a hooked component
const App = () => {
    var mode = useViewport();
    return <AppComponent device_mode={mode} />;
}
export { App };

class AppComponent extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: null, loading: true,// loggedIn and loading flag
            uid: null, account_info: null, safe: null, folders: null, // store important userinfo
            searchString: null, selectedFolderID: null // what the user is searching for and what they have selected within the safe
        };

        //function bindings
        this.attemptRefresh = this.attemptRefresh.bind(this);
        this.updateUserLoggedIn = this.updateUserLoggedIn.bind(this);
        this.FetchSafe = this.FetchSafe.bind(this);
        this.FetchUserFolders = this.FetchUserFolders.bind(this);
        this.FetchUserInfo = this.FetchUserInfo.bind(this);
        this.SetSearchString = this.SetSearchString.bind(this);
        this.SetSelectedFolder = this.SetSelectedFolder.bind(this);
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
            // set path options based on whether or not the user is logged in and device mode
            if (this.props.device_mode == 0) // mobile
                return (
                    <Layout device_mode={this.props.device_mode} loggedIn={this.state.loggedIn} folders={this.state.folders} SetSelectedFolder={this.SetSelectedFolder}>
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
                                <DashBoard device_mode={this.props.device_mode} uid={this.state.uid} safe={this.state.safe} searchString={this.state.searchString} SetSearchString={this.SetSearchString} selectedFolderID={this.state.selectedFolderID}/>
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/account' render={() => (
                            this.state.loggedIn ? (
                                <Account uid={this.state.uid} />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                    </Layout>
                );
            else // desktop
                return (
                    <Layout device_mode={this.props.device_mode} loggedIn={this.state.loggedIn}>
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
                                <DashBoard device_mode={this.props.device_mode} uid={this.state.uid} safe={this.state.safe} folders={this.state.folders} selectedFolderID={this.state.selectedFolderID} searchString={this.state.searchString} SetSearchString={this.SetSearchString} SetSelectedFolder={this.SetSelectedFolder} />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/account' render={() => (
                            this.state.loggedIn ? (
                                <Account uid={this.state.uid} account_info={this.state.account_info} />
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
    async updateUserLoggedIn(uidStr) {
        this.setState({ loading: true, loggedIn: true, uid: uidStr });
        await this.FetchSafe(); // get accounts
        await this.FetchUserFolders(); // get users folders
        await this.FetchUserInfo(); // get user account info
        this.setState({ loading: false });
    }

    // call back function for app to set user logged out... NOTE: here we will want to clear all user info
    updateUserLoggedOut() {
        this.setState({ loggedIn: false, uid: null });
    }

    // attempt to retrieve a new access token with the existing cookies.. Note that cookies are http only and contain JWT tokens and refresh tokens
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
            await this.FetchSafe(); // get accounts
            await this.FetchUserFolders(); // get users folders
            await this.FetchUserInfo();
            this.setState({loading: false}); // done loading
        }
        else
            this.setState({ loading: false, loggedIn: false});
    }

    //fetch all the users accounts.. may move this to safe, but for now we have it here to easily know whether to display loading or not
    async FetchSafe() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.state.uid + '/accounts';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ safe: JSON.parse(responseText).accounts })
        }
    }

    // get all the folders that the users has created
    async FetchUserFolders() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.state.uid + '/folders';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ folders: JSON.parse(responseText).folders })
        }
    }

    // get user account info for the settings area.. might move this out of dashboard eventually
    async FetchUserInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.state.uid;

        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ account_info: responseText })
        }
    }

    // call back for the sidebar to set search params for the safe
    SetSearchString(str) {
        this.setState({ searchString: str });
    }

    // call back for the Folder component to set selected for the safe
    SetSelectedFolder(id) {
        this.setState({ selectedFolderID: id });
    }
}