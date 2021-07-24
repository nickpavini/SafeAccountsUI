import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AttempRefresh, RemoveSafeItemLocally, CloseSelectedItemsMenu } from '../../../HelperFunctions.js'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './SelectedItemsMenu.css';

export class SelectedItemsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, isFirstRender: true,
            parentID: -1, // -1 as holder because null is top parent
        };

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.DeleteMultipleItems = this.DeleteMultipleItems.bind(this);
        this.MoveItems = this.MoveItems.bind(this);
        this.ListFolders = this.ListFolders.bind(this);
        this.GoBack = this.GoBack.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    render() {
        // redirect if needed
        if (this.state.redirect)
            return <Redirect to='/account' />

        // in this case we have selected the moveTo button
        else if (this.state.parentID !== -1) {
            return (
                <div id="menu_selected_items">
                    <div id="div_selected_items_move_options">
                        <FontAwesomeIcon id="icon_menu_selected_items_back" icon={faArrowLeft} onClick={this.GoBack}/>
                        <button id="btn_selected_items_move_here" onClick={this.MoveItems}>Move Here</button>
                    </div>
                    {this.ListFolders()}
                </div>
            );
        }

        // menu options
        else {
            return (
                <div id="menu_selected_items" >
                    <div className="menu_selected_items" id="menu_selected_items_delete" onClick={this.DeleteMultipleItems}>Delete Items</div>
                    <div className="menu_selected_items" id="menu_selected_items_move_to" onClick={() => this.setState({ parentID: null })}>Move To {'>'}</div>
                </div>
            );
        }
    }

    // unrender if we click away
    async handleClick(e) {
        if (this.state.isFirstRender || // dont close if the icon was clicked.. this menu is getting closed up first open
            e.target.id.includes("move_to") || // dont close if selecting folders for moving
            e.target.id === "icon_menu_selected_items_back" || // dont close if we selected the back arrow
            (
                e.target.nearestViewportElement !== undefined &&
                e.target.nearestViewportElement !== null &&
                e.target.nearestViewportElement.id === "icon_menu_selected_items_back"
            ))
        {
            this.setState({ isFirstRender: false });
            return;
        }

        CloseSelectedItemsMenu(this.props.SetAppState);
    }

    GoBack() {
        // if we are at null, reset parent id to get us back to main menu for selected items
        if (this.state.parentID === null) {
            this.setState({ parentID: -1 });
        }
        else {
            // get id of the currently selected folders parent
            var prevFolderIndex = this.props.AppState.folders.findIndex(e => e.id === this.state.parentID);
            var prevFolderID = this.props.AppState.folders[prevFolderIndex].parentID;
            this.setState({ parentID: prevFolderID });
        }
    }

    // DELETE multiple items from the safe
    async DeleteMultipleItems() {
        // HTTP request options
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify(Array.from(this.props.AppState.selectedItems)),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/accounts', requestOptions);
        if (response.ok) {
            var updatedSafe = this.props.AppState.safe;
            this.props.AppState.selectedItems.forEach(e => {
                // if one fails to be removed, then we throw error... later we may want it to do fetchsafe as backup
                if (!RemoveSafeItemLocally(e, updatedSafe))
                    throw new Error({ code: 500, message: "Error: Could not remove item from safe locally" });
            });
            this.props.SetAppState({ safe: updatedSafe, selectedItems: new Set() });
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.DeleteMultipleItems(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }

    ListFolders() {
        return (
            <div id="div_folders_to_move_to">
                {
                    // go through each folder
                    this.props.AppState.folders.map((value, index) => {
                        if (value.parentID === this.state.parentID)
                            return (
                                <div className="menu_selected_items" id="menu_selected_items_move_to" onClick={() => this.setState({ parentID: value.id })}>
                                    {value.folderName}
                                </div>
                            );
                        return null;
                    })
                }
            </div>
        );
    }

    async MoveItems() {
        // set the body of our request
        var body = {
            "account_ids": Array.from(this.props.AppState.selectedItems),
            "folder_id": this.state.parentID === null ? 0 : this.state.parentID // api doesnt support null sending so we use 0
        };

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify(body),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/accounts/folder', requestOptions);
        if (response.ok) {
            var updatedSafe = this.props.AppState.safe;
            // go through each selected safe item and set their folder to parentID
            this.props.AppState.selectedItems.forEach(e => {
                var itemIndex = this.props.AppState.safe.findIndex(f => f.id === e); // get index of safeitem
                updatedSafe[itemIndex].folderID = this.state.parentID;
            });
            this.props.SetAppState({ safe: updatedSafe, selectedItems: new Set() });
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.MoveItems(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
