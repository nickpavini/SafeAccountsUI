import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';
import { SearchBar } from '../SearchBar/SearchBar';
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        //bind functions
        this.ResetFilters = this.ResetFilters.bind(this);
        this.closeSideMenu = this.closeSideMenu.bind(this);
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
                return <button id="btn_close_sidebar" onClick={this.closeSideMenu}>X</button>;
        }

        // top folder so parent is null.. we list folders with parents=null and call a Folder for each folder that is a parent
        return (
            <div className="div_SafeSideBar" id="div_SafeSideBar">
                {RenderCloseButton()}
                <div className="div_safesidebar_navigation">
                    {RenderSearchBar()}
                    <div id="div_sidebar_all_entries" onClick={this.ResetFilters}><FontAwesomeIcon id="icon_all_entries" icon={faThLarge} /><span id="span_sidebar_all_entries">All Entries</span></div>
                    <label id="lbl-folders"><b>Folders</b></label><button id="btn_add_folder">&#x2b;</button>
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
                            contents = <Folder key={value.id} folder={value} selectedFolderID={this.props.selectedFolderID} SetSelectedFolder={this.props.SetSelectedFolder} />;

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
        this.props.SetSearchString("");
        this.props.SetSelectedFolder(null);
    }

    // closes side menu on mobile... 
    closeSideMenu() {
        document.getElementById("div_SafeSideBar").style.width = "0"; // this makes it slide to the left
        document.getElementById("btn_close_sidebar").style.display = "none";

        // after closing width make border invisible so left side doesnt stick out
        setTimeout(() => {
            document.getElementById("div_SafeSideBar").style.border = "none"; // make it invisible so there isnt a small bar off to the left
        }, 500);
    }
}
