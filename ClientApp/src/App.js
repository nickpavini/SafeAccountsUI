import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router';
import { Layout } from './components/Layout.js';
import { Home } from './components/Home/Home';
import { SignUp } from './components/SignUp/SignUp';
import { Login } from './components/Login/Login';
import { DashBoard } from './components/DashBoard/DashBoard.js';
import { Account } from './components/Account/Account';
import { SafeSideBar } from './components/SafeSideBar/SafeSideBar';
import { AddEditSafeItem } from './components/AddEditSafeItem/AddEditSafeItem';
import { EmailConfirmation } from './components/EmailConfirmation/EmailConfirmation.js';
import { DecryptFolders, DecryptSafe, AttempRefresh } from './components/HelperFunctions.js'
import './custom.css'

localStorage.setItem("MOBILE_MODE", "MOBILE");
localStorage.setItem("DESKTOP_MODE", "DESKTOP");

// hook for returning device mode based on width
const useViewport = () => {
    const [windowDimensions, setDimensions] = React.useState({ width: window.innerWidth, height: window.innerHeight });

    React.useEffect(() => {
        const handleWindowResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    // these numbers will likely change
    var mode;
    if (windowDimensions.width < 800)
        mode = localStorage.getItem("MOBILE_MODE"); // mobile
    else
        mode = localStorage.getItem("DESKTOP_MODE"); // desktop

    return [mode, windowDimensions];
}

// layer the app with a hooked component
const App = () => {
    var modeAndDimensions = useViewport();

    // prevent default context menu all around
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
    });

    // return app in the correct device mode
    return <AppComponent device_mode={modeAndDimensions[0]} windowDimensions={modeAndDimensions[1]} />;
}
export { App };

class AppComponent extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            device_mode: props.device_mode, windowDimensions: props.windowDimensions,
            loggedIn: null, loading: true,// loggedIn and loading flag
            uid: null, account_info: null, safe: null, folders: null, // store important userinfo
            searchString: null, selectedFolderID: null, showFavorites: false, // what the user is searching for and what they have selected within the safe
            openSelectedItemsMenu: false,
        };

        //function bindings
        this.LoadApp = this.LoadApp.bind(this);
        this.SetAppState = this.SetAppState.bind(this);
        this.UpdateUserLoggedIn = this.UpdateUserLoggedIn.bind(this);
        this.FetchSafe = this.FetchSafe.bind(this);
        this.FetchUserFolders = this.FetchUserFolders.bind(this);
        this.FetchUserInfo = this.FetchUserInfo.bind(this);
    }

    componentDidMount() {
        this.LoadApp();
    }

    static getDerivedStateFromProps(props, current_state) {
        return {
            device_mode: props.device_mode,
            windowDimensions: props.windowDimensions
        }
    }

    render() {
        var contents = null;

        // check to see if we are waiting on a response from the api
        if (this.state.loading) {
            contents = <p>Loading...</p>;
        }
        else {
            const RenderSafeSideBar = () => {
                if (this.state.loggedIn && this.state.device_mode === localStorage.getItem("MOBILE_MODE"))
                    return <SafeSideBar
                        AppState={this.state}
                        SetAppState={this.SetAppState}
                    />
            }

            // set path options based on whether or not the user is logged in and device mode
            contents = (
                <div>
                    {RenderSafeSideBar()}
                    <Layout
                        AppState={this.state}
                        SetAppState={this.SetAppState}
                    >
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
                                    <Login UpdateUserLoggedIn={this.UpdateUserLoggedIn} />
                                )
                        )} />
                        <Route path='/signup' render={() => (
                            this.state.loggedIn ? (
                                <Redirect to="/dashboard" />
                            ) : (
                                    <SignUp />
                                )
                        )} />
                        <Route path='/emailconfirmation' render={() => (
                            this.state.loggedIn ? (
                                <Redirect to="/dashboard" />
                            ) : (
                                    <EmailConfirmation />
                                )
                        )} />
                        <Route path='/dashboard' render={() => (
                            this.state.loggedIn ? (
                                <DashBoard
                                    AppState={this.state}
                                    SetAppState={this.SetAppState}
                                />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/safeitems/:item_id' render={(props) => (
                            this.state.loggedIn ? (
                                <AddEditSafeItem
                                    AppState={this.state}
                                    SetAppState={this.SetAppState}
                                    info={this.state.safe.find(e => e.id.toString() === props.location.pathname.split("/").pop())}
                                />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/account' render={() => (
                            this.state.loggedIn ? (
                                <Account AppState={this.state}/>
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                    </Layout>
                </div>
            );
        }

        return (contents);
    }

    // call back function for app to set user logged in
    async UpdateUserLoggedIn(uidStr) {
        this.setState({ loading: true, loggedIn: true, uid: uidStr });
        await this.FetchSafe(); // get accounts
        await this.FetchUserFolders(); // get users folders
        await this.FetchUserInfo(); // get user account info
        this.setState({ loading: false });
    }

    // attempt to retrieve a new access token with the existing cookies.. Note that cookies are http only and contain JWT tokens and refresh tokens
    async LoadApp() {
        const uid = await AttempRefresh()
        if (uid !== null) {
            this.setState({ loggedIn: true, uid: uid });
            await this.FetchSafe(); // get accounts
            await this.FetchUserFolders(); // get users folders
            await this.FetchUserInfo(); // get user account info
            this.setState({ loading: false }); // done loading
        }
        else
            this.setState({ loading: false, loggedIn: false });
    }

    //fetch all the users accounts.. may move this to safe, but for now we have it here to easily know whether to display loading or not
    async FetchSafe() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = process.env.REACT_APP_WEBSITE_URL + '/users/' + this.state.uid + '/accounts';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            //get safe and decypt
            const responseText = await response.text();
            var safe = JSON.parse(responseText);
            this.setState({ safe: DecryptSafe(safe) })
        }
    }

    // get all the folders that the users has created
    async FetchUserFolders() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = process.env.REACT_APP_WEBSITE_URL + '/users/' + this.state.uid + '/folders';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var folders = JSON.parse(responseText);
            this.setState({ folders: DecryptFolders(folders) })
        }
    }

    // get user account info for the settings area.. might move this out of dashboard eventually
    async FetchUserInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = process.env.REACT_APP_WEBSITE_URL + '/users/' + this.state.uid;

        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ account_info: responseText })
        }
    }

    // layered function to allow setState from outside helper function
    SetAppState(stateChange) {
        this.setState(stateChange);
    }
}