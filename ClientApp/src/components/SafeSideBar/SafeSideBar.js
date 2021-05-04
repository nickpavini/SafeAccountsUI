import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';
import { SearchBar } from '../SearchBar/SearchBar';

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        //bind functions
        this.ResetFilters = this.ResetFilters.bind(this);
    }

    render() {
        const RenderSearchBar = () => {
            if (this.props.device_mode == localStorage.getItem("DESKTOP_MODE"))
                return <SearchBar SetSearchString={this.props.SetSearchString} />;
        }

        // top folder so parent is null.. we list folders with parents=null and call a Folder for each folder that is a parent
        return (
            <div class="div_SafeSideBar">
                <label id="lbl_safeaccounts_navigation">Navigation</label>
                <div class="div_safesidebar_navigation">
                    {RenderSearchBar()}
                    <li><button id="btn_safesidebar_all" onClick={this.ResetFilters}>All Entries</button></li>
                    <label id="lbl-folders"><b>Folders</b></label><button id="btn_delete_folder">&#x1F5D1;</button><button id="btn_add_folder">&#x2b;</button>
                    <div id="folder_top_level">
                        <Folder Folders={this.props.Folders} ParentID={null} SetSelectedFolder={this.props.SetSelectedFolder} />
                    </div>
                </div>

            </div>
        );
    }

    // reset the selected folder and searchstring
    async ResetFilters() {
        document.getElementById("input_text_safe_search").value = "";
        this.props.SetSearchString("");
        this.props.SetSelectedFolder(null);
    }
}
