import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';
import { SearchBar } from '../SearchBar/SearchBar';
import { faThLarge, faFolderPlus, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderContextMenu } from './Folder/FolderContextMenu/FolderContextMenu';
import { SetSearchString, SetSelectedFolder, ShowFavorites, AddFolder, SetFolderParent, SetItemFolder } from '../HelperFunctions.js'

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        //bind functions
        this.ResetFilters = this.ResetFilters.bind(this);
        this.closeSideMenu = this.closeSideMenu.bind(this);
        this.DropOnAllEntries = this.DropOnAllEntries.bind(this);
        this.DropOnFolderLabel = this.DropOnFolderLabel.bind(this);
    }

    render() {
        // conditional rendering of the context menu
        const RenderFolderContextMenu = () => {
            if (this.props.AppState.openFolderContextMenu)
                return <FolderContextMenu
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                    folder={this.props.AppState.folders.find(e => e.id === this.props.AppState.menu_folder_id)}
                />;
        }

        // only render the searchbar in this component on desktop
        const RenderSearchBar = () => {
            if (this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SearchBar SetAppState={this.props.SetAppState} />;
        }

        // add a close option to the menu on mobile
        const RenderCloseButton = () => {
            if (this.props.AppState.device_mode === localStorage.getItem("MOBILE_MODE"))
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
                    <div id="div_sidebar_favorites" onClick={() => ShowFavorites(this.props.SetAppState)}><FontAwesomeIcon id="icon_favorites" icon={faStar} /><span id="span_sidebar_favorites">Favorites</span></div>
                    <div id="div_Folders_Options" ><span id="span_safesidebar_folders" onDrop={this.DropOnFolderLabel} onDragOver={this.FolderLabelAllowDrop} >Folders</span><FontAwesomeIcon id="icon_add_folder" icon={faFolderPlus} onClick={() => AddFolder(this.props.AppState, this.props.SetAppState)} /></div>
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
                    this.props.AppState.folders.map((value, index) => {
                        var contents;

                        // if the current folder we are looking at has the parent that was passed in, we add it to the tree
                        if (value.parentID === parentID) {
                            // if the current folder is a child of the parent we list, then we display the folder
                            contents = <Folder
                                key={value.id}
                                AppState={this.props.AppState}
                                SetAppState={this.props.SetAppState}
                                folder={value}
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

    // reset the selected folder and searchstring
    async ResetFilters() {
        document.getElementById("input_text_safe_search").value = "";
        SetSearchString("", this.props.SetAppState);
        SetSelectedFolder(null, this.props.SetAppState);
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
            SetItemFolder(JSON.parse(event.dataTransfer.getData("safeitem")), 0, this.props.AppState, this.props.SetAppState);
    }

    DropOnFolderLabel(event) {
        event.preventDefault();

        // if the dropped element is a folder, we set its parent to 0 or null, meaning no parent
        if (event.dataTransfer.getData("folder") !== "")
            SetFolderParent(JSON.parse(event.dataTransfer.getData("folder")), 0, this.props.AppState, this.props.SetAppState)
    }
}
