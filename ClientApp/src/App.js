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
import { AddSafeItem } from './components/AddSafeItem/AddSafeItem';
import { EmailConfirmation } from './components/EmailConfirmation/EmailConfirmation.js';
import { EditSafeItem } from './components/EditSafeItem/EditSafeItem.js';
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
            loggedIn: null, loading: true,// loggedIn and loading flag
            uid: null, account_info: null, safe: null, folders: null, // store important userinfo
            searchString: null, selectedFolderID: null, // what the user is searching for and what they have selected within the safe
            showFavorites: false
        };

        //function bindings
        this.attemptRefresh = this.attemptRefresh.bind(this);
        this.updateUserLoggedIn = this.updateUserLoggedIn.bind(this);
        this.UpdateUserLoggedOut = this.UpdateUserLoggedOut.bind(this);
        this.FetchSafe = this.FetchSafe.bind(this);
        this.FetchUserFolders = this.FetchUserFolders.bind(this);
        this.FetchUserInfo = this.FetchUserInfo.bind(this);
        this.SetSearchString = this.SetSearchString.bind(this);
        this.SetSelectedFolder = this.SetSelectedFolder.bind(this);
        this.ShowFavorites = this.ShowFavorites.bind(this);
        this.UpdateSafeItem = this.UpdateSafeItem.bind(this);
        this.UpdateSingleFolder = this.UpdateSingleFolder.bind(this);
        this.UpdateFolders = this.UpdateFolders.bind(this);
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
            const RenderSafeSideBar = () => {
                if (this.state.loggedIn && this.props.device_mode === localStorage.getItem("MOBILE_MODE"))
                    return <SafeSideBar device_mode={this.props.device_mode} uid={this.state.uid} Folders={this.state.folders} FetchUserFolders={this.FetchUserFolders}
                        selectedFolderID={this.state.selectedFolderID} SetSelectedFolder={this.SetSelectedFolder} UpdateFolders={this.UpdateFolders}
                        SetSearchString={this.SetSearchString} ShowFavorites={this.ShowFavorites} UpdateSafeItem={this.UpdateSafeItem} attemptRefresh={this.attemptRefresh}
                    />
            }

            // set path options based on whether or not the user is logged in and device mode
            contents = (
                <div>
                    {RenderSafeSideBar()}
                    <Layout device_mode={this.props.device_mode} windowDimensions={this.props.windowDimensions} loggedIn={this.state.loggedIn} UpdateUserLoggedOut={this.UpdateUserLoggedOut} SetSearchString={this.SetSearchString}>
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
                        <Route path='/emailconfirmation' render={() => (
                            this.state.loggedIn ? (
                                <Redirect to="/dashboard" />
                            ) : (
                                    <EmailConfirmation />
                                )
                        )} />
                        <Route path='/dashboard' render={() => (
                            this.state.loggedIn ? (
                                <DashBoard device_mode={this.props.device_mode} uid={this.state.uid} safe={this.state.safe} FetchSafe={this.FetchSafe} folders={this.state.folders} FetchUserFolders={this.FetchUserFolders} UpdateFolders={this.UpdateFolders} searchString={this.state.searchString} SetSearchString={this.SetSearchString} selectedFolderID={this.state.selectedFolderID} SetSelectedFolder={this.SetSelectedFolder} showFavorites={this.state.showFavorites} UpdateSafeItem={this.UpdateSafeItem} attemptRefresh={this.attemptRefresh} ShowFavorites={this.ShowFavorites}/>
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/safeitems/:item_id' render={(props) => (
                            this.state.loggedIn ? (
                                <EditSafeItem info={this.state.safe.find(e => e.id.toString() === props.location.pathname.split("/").pop())} uid={this.state.uid} FetchSafe={this.FetchSafe} attemptRefresh={this.attemptRefresh} />
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/addsafeitem' render={() => (
                            this.state.loggedIn ? (
                                <AddSafeItem device_mode={this.props.device_mode} uid={this.state.uid} FetchSafe={this.FetchSafe} attemptRefresh={this.attemptRefresh}/>
                            ) : (
                                    <Redirect to="/login" />
                                )
                        )} />
                        <Route path='/account' render={() => (
                            this.state.loggedIn ? (
                                <Account uid={this.state.uid} account_info={this.state.account_info}/>
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
    async updateUserLoggedIn(uidStr) {
        this.setState({ loading: true, loggedIn: true, uid: uidStr });
        await this.FetchSafe(); // get accounts
        await this.FetchUserFolders(); // get users folders
        await this.FetchUserInfo(); // get user account info
        this.setState({ loading: false });
    }

    // call back function for app to set user logged out... NOTE: here we will make a call to the server which removes the cookies in the returning response
    async UpdateUserLoggedOut() {
        // http request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = 'https://localhost:44366/users/logout';
        const response = await fetch(reqURI, requestOptions); // this request will remove users cookies
        if (response.ok) {
            // reset state after removing cookies.. this will cause re-render and should make app be not logged in
            this.setState({
                loggedIn: false, loading: false, // user is now logged out.. login page will render
                uid: null, account_info: null, safe: null, folders: null,
                searchString: null, selectedFolderID: null
            });
        }
        else {
            /* Not sure what would be appropriate here, but eventually we could add a fail safe here*/
        }
    }

    // attempt to retrieve a new access token with the existing cookies.. Note that cookies are http only and contain JWT tokens and refresh tokens
    async attemptRefresh() {

        // http request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        // make a call to the refresh and if the result is ok, then we are logged in
        const reqURI = 'https://localhost:44366/refresh';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var obj = JSON.parse(responseText);
            this.setState({ loggedIn: true, uid: obj.id });
            await this.FetchSafe(); // get accounts
            await this.FetchUserFolders(); // get users folders
            await this.FetchUserInfo();
            this.setState({ loading: false }); // done loading
            return true;
        }
        else {
            this.setState({ loading: false, loggedIn: false });
            return false;
        }
    }

    //fetch all the users accounts.. may move this to safe, but for now we have it here to easily know whether to display loading or not
    async FetchSafe() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = 'https://localhost:44366/users/' + this.state.uid + '/accounts';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ safe: JSON.parse(responseText) })
        }
    }

    // get all the folders that the users has created
    async FetchUserFolders() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = 'https://localhost:44366/users/' + this.state.uid + '/folders';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ folders: JSON.parse(responseText) })
        }
    }

    // get user account info for the settings area.. might move this out of dashboard eventually
    async FetchUserInfo() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            credentials: 'include'
        };

        const reqURI = 'https://localhost:44366/users/' + this.state.uid;

        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ account_info: responseText })
        }
    }

    // call back for the sidebar to set search params for the safe.. If a folder, or favorites category is selected, search string will search within the additional specs
    SetSearchString(str) {
        this.setState({ searchString: str, showFavorites: false });
    }

    // call back for the Folder component to set selected for the safe.. if a new folder was chosen, then we update showFavorites to false. This also happens when All entries is selected
    SetSelectedFolder(id) {
        this.setState({ selectedFolderID: id, showFavorites: false });
    }

    // sets the showFavorites attribute to true, and resets the searchstring and folder
    ShowFavorites() {
        document.getElementById("input_text_safe_search").value = "";
        this.setState({ showFavorites: true, searchString: "", selectedFolderID: null });
    }

    // add or edit an item in the safe
    UpdateSafeItem(safeitem) {
        var updatedSafe = this.state.safe; // copy current safe
        var itemIndex = this.state.safe.findIndex(e => e.id === safeitem.id); // get index of safeitem passed in

        // if the safe item already exists, this is a modification
        if (itemIndex !== -1) {
            updatedSafe[itemIndex] = safeitem; // modify safeitem
        }
        // if the safe item does not exist, we are adding it to the safe
        else {
            updatedSafe.push(safeitem);
        }


        this.setState({ safe: updatedSafe }); // update state for re-render
    }

    // add or edit a folder
    UpdateSingleFolder(folder) {
        var updatedFolders = this.state.folders; // copy current folders
        var itemIndex = this.state.folders.findIndex(e => e.id === folder.id); // get index of folder passed in

        // if the folder already exists, this is a modification
        if (itemIndex !== -1) {
            updatedFolders[itemIndex] = folder; // modify
        }
        // if the folder does not exist, we are adding it
        else {
            updatedFolders.push(folder);
        }

        this.setState({ folders: updatedFolders }); // update state for re-render
    }

    // update all folders at once
    UpdateFolders(updatedFolders) {
        this.setState({folders: updatedFolders});
    }
}