import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';
import { SearchBar } from '../SearchBar/SearchBar';
import { faThLarge, faFolderPlus, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderContextMenu } from './Folder/FolderContextMenu/FolderContextMenu';
import { DecryptFolders, Encrypt } from '../HelperFunctions.js'

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        // set to hold the ids of which items are currently selected
        this.state = {
            openContextMenu: false, menu_top: "0px",
            menu_left: "0px", menu_folder_id: null
        };

        //bind functions
        this.ResetFilters = this.ResetFilters.bind(this);
        this.closeSideMenu = this.closeSideMenu.bind(this);
        this.AddFolder = this.AddFolder.bind(this);
        this.OpenContextMenu = this.OpenContextMenu.bind(this); // functions for the folder context menu
        this.CloseContextMenu = this.CloseContextMenu.bind(this);
        this.DropOnAllEntries = this.DropOnAllEntries.bind(this);
        this.DropOnFolderLabel = this.DropOnFolderLabel.bind(this);
        this.SetItemFolder = this.SetItemFolder.bind(this);
        this.SetFolderParent = this.SetFolderParent.bind(this);
    }

    render() {
        // conditional rendering of the context menu
        const RenderFolderContextMenu = () => {
            if (this.state.openContextMenu)
                return <FolderContextMenu uid={this.props.uid} folder={this.props.Folders.find(e => e.id === this.state.menu_folder_id)} AddFolder={this.AddFolder}
                    top={this.state.menu_top} left={this.state.menu_left} CloseContextMenu={this.CloseContextMenu} attemptRefresh={this.props.attemptRefresh}
                    UpdateFolders={this.props.UpdateFolders} UpdateSafe={this.props.UpdateSafe}
                />;
        }

        // only render the searchbar in this component on desktop
        const RenderSearchBar = () => {
            if (this.props.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SearchBar SetSearchString={this.props.SetSearchString} />;
        }

        // add a close option to the menu on mobile
        const RenderCloseButton = () => {
            if (this.props.device_mode === localStorage.getItem("MOBILE_MODE"))
                return <FontAwesomeIcon id="icon_close_sidebar" icon={faTimes} onClick={this.closeSideMenu} />;
        }

        // top folder so parent is null.. we list folders with parents=null and call a Folder for each folder that is a parent
        return (
            <div className="div_SafeSideBar" id="div_SafeSideBar">
                {RenderFolderContextMenu()}
                {RenderCloseButton()}
                <div className="div_safesidebar_navigation">
                    {RenderSearchBar()}
                    <div id="div_sidebar_all_entries" onClick={this.ResetFilters} onDrop={this.DropOnAllEntries} onDragOver={this.AllEntriesAllowDrop}><FontAwesomeIcon id="icon_all_entries" icon={faThLarge} /><span id="span_sidebar_all_entries">All Entries</span></div>
                    <div id="div_sidebar_favorites" onClick={this.props.ShowFavorites}><FontAwesomeIcon id="icon_favorites" icon={faStar} /><span id="span_sidebar_favorites">Favorites</span></div>
                    <div id="div_Folders_Options" ><span id="span_safesidebar_folders" onDrop={this.DropOnFolderLabel} onDragOver={this.FolderLabelAllowDrop} >Folders</span><FontAwesomeIcon id="icon_add_folder" icon={faFolderPlus} onClick={this.AddFolder} /></div>
                    {this.ParseFolders(null)}
                </div>

            </div>
        );
    }

    // parses folders and returns the needed html
    ParseFolders(parentID) {
        return (
            <div id="div_folders" >
                {
                    // go through each folder
                    this.props.Folders.map((value, index) => {
                        var contents;

                        // if the current folder we are looking at has the parent that was passed in, we add it to the tree
                        if (value.parentID === parentID) {
                            // if the current folder is a child of the parent we list, then we display the folder
                            contents = <Folder key={value.id} uid={this.props.uid} folder={value} OpenContextMenu={this.OpenContextMenu}
                                selectedFolderID={this.props.selectedFolderID} SetSelectedFolder={this.props.SetSelectedFolder} UpdateFolders={this.props.UpdateFolders}
                                UpdateSingleFolder={this.props.UpdateSingleFolder} UpdateSafeItem={this.props.UpdateSafeItem} SetItemFolder={this.SetItemFolder}
                                SetFolderParent={this.SetFolderParent} attemptRefresh={this.props.attemptRefresh}
                            />;

                            // if this folder is a parent we need to parse it children into a new div with a slight margin
                            if (value.hasChild) {
                                var childID = "div_folder_" + value.id + "_child";
                                var key = "div_folder_" + value.id + "_key"; // not sure what this should be

                                contents = (
                                    <div key={key}>
                                        {contents}
                                        <div id={childID} style={{ marginLeft: "8px", display: "none" }}>
                                            {this.ParseFolders(value.id)}
                                        </div>
                                    </div>
                                );
                            }
                        }

                        // return contents
                        return contents;
                    })
                }
            </div>
        );
    }

    // adds a new folder to the props, and updates the db remotely
    async AddFolder(firstTry = true) {
        // append to the props only if this isnt a retry after a potentially fixable error
        if (firstTry) {
            this.props.Folders.push({ id: -1, folderName: "New Folder", parentID: null });
            this.forceUpdate(); // Force a render without state change...
        }

        // HTTP request options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify({ folder_name: Encrypt("New Folder") }),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.uid + '/folders', requestOptions);
        if (response.ok) {
            this.props.FetchUserFolders(); // legit update folders, first one was just visual
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.AddFolder(false); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            // if it didnt work then lets make sure to remove the visual new folder
            this.props.Folders.pop();
            this.forceUpdate(); // Force a render without state change...
        }
    }

    // reset the selected folder and searchstring
    async ResetFilters() {
        document.getElementById("input_text_safe_search").value = "";
        this.props.SetSearchString("");
        this.props.SetSelectedFolder(null);
    }

    // closes side menu on mobile... 
    closeSideMenu() {
        document.getElementById("div_SafeSideBar").style.width = "0"; // this makes it slide to the left
        document.getElementById("icon_close_sidebar").style.display = "none";
        document.getElementById("icon_add_folder").style.display = "none";

        // after closing width make border invisible so left side doesnt stick out
        setTimeout(() => {
            document.getElementById("div_SafeSideBar").style.border = "none"; // make it invisible so there isnt a small bar off to the left
        }, 500);
    }

    async OpenContextMenu(folder_id, left, top) {
        this.setState({ openContextMenu: true, menu_top: top, menu_left: left, menu_folder_id: folder_id })
    }

    async CloseContextMenu() {
        this.setState({ openContextMenu: false });
    }

    // makes it so hovering item can be dropped
    AllEntriesAllowDrop(event) {
        event.preventDefault();
    }

    // kept as seperate function for now in case we need more functionality
    FolderLabelAllowDrop(event) {
        event.preventDefault();
    }

    // what to do when something is dropped on all entries
    DropOnAllEntries(event) {
        event.preventDefault();

        // if the dropped element is a safe item, we set that item to be associated with this folder
        if (event.dataTransfer.getData("safeitem") !== "")
            this.SetItemFolder(JSON.parse(event.dataTransfer.getData("safeitem")), 0);
    }

    DropOnFolderLabel(event) {
        event.preventDefault();

        // if the dropped element is a folder, we set its parent to 0 or null, meaning no parent
        if (event.dataTransfer.getData("folder") !== "")
            this.SetFolderParent(JSON.parse(event.dataTransfer.getData("folder")), 0)
    }

    // sets the passed in folder to be a child of this folder (regarding the current component)
    async SetFolderParent(folder, folder_id) {
        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: folder_id,
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.uid + '/folders/' + folder.id + '/parent', requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var folders = JSON.parse(responseText);
            this.props.UpdateFolders(DecryptFolders(folders)); // update the folders
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.SetFolderParent(folder, folder_id); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
        }
    }

    async SetItemFolder(safeitem, folder_id) {
        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: folder_id,
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.uid + '/accounts/' + safeitem.id + '/folder', requestOptions);
        if (response.ok) {
            safeitem.folderID = folder_id === 0 ? null : folder_id;
            this.props.UpdateSafeItem(safeitem); // later we may want to do this before the call, and just re-update if the call fails.. it will speed up responsiveness
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.SetItemFolder(safeitem, folder_id); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
        }
    }
}
