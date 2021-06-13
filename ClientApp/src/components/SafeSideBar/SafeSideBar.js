import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';
import { SearchBar } from '../SearchBar/SearchBar';
import { faThLarge, faFolderPlus, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        //bind functions
        this.ResetFilters = this.ResetFilters.bind(this);
        this.closeSideMenu = this.closeSideMenu.bind(this);
        this.AddFolder = this.AddFolder.bind(this);
    }

    render() {
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
                {RenderCloseButton()}
                <div className="div_safesidebar_navigation">
                    {RenderSearchBar()}
                    <div id="div_sidebar_all_entries" onClick={this.ResetFilters}><FontAwesomeIcon id="icon_all_entries" icon={faThLarge} /><span id="span_sidebar_all_entries">All Entries</span></div>
                    <div id="div_sidebar_favorites" onClick={this.props.ShowFavorites}><FontAwesomeIcon id="icon_favorites" icon={faStar} /><span id="span_sidebar_favorites">Favorites</span></div>
                    <div id="div_Folders_Options" ><span id="span_safesidebar_folders">Folders</span><FontAwesomeIcon id="icon_add_folder" icon={faFolderPlus} onClick={this.AddFolder}/></div>
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
                            contents = <Folder key={value.id} uid={this.props.uid} folder={value}
                                selectedFolderID={this.props.selectedFolderID} SetSelectedFolder={this.props.SetSelectedFolder}
                                UpdateSafeItem={this.props.UpdateSafeItem} attemptRefresh={this.props.attemptRefresh}
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
            body: JSON.stringify({ folder_name: "New Folder" }),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/' + this.props.uid + '/folders', requestOptions);
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
}
