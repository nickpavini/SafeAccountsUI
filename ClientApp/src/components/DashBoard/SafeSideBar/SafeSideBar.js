import React, { Component } from 'react';
import './SafeSideBar.css';
import { Folder } from './Folder/Folder';

export class SafeSideBar extends Component {
    static displayName = SafeSideBar.name;

    constructor(props) {
        super(props);

        //bind functions
        this.SearchStringChanged = this.SearchStringChanged.bind(this);
        this.ResetFilters = this.ResetFilters.bind(this);
    }

    componentDidMount() {
        
    }

    render() {

        // top folder so parent is null.. we list folders with parents=null and call a Folder for each folder that is a parent
        return (
            <div class="div_SafeSideBar">
                <label id="lbl_safeaccounts_navigation">Navigation</label>
                <div class="div_safesidebar_navigation">
                    <textarea maxLength="15" id="input_text_safe_search" onInput={this.SearchStringChanged} rows="1" placeholder="Search Safe"></textarea><br />
                    <li><button id="btn_safesidebar_all" onClick={this.ResetFilters}>All Entries</button></li>
                    <label id="lbl-folders"><b>Folders</b></label><button id="btn_delete_folder">&#x1F5D1;</button><button id="btn_add_folder">&#x2b;</button>
                    <div id="folder_top_level">
                        <Folder Folders={this.props.Folders} ParentID={null} SetSelectedFolder={this.props.SetSelectedFolder} />
                    </div>
                </div>

            </div>
        );
    }

    // update the search string to update view
    async SearchStringChanged(event) {
        this.props.SetSearchString(event.target.value)
    }

    // reset the selected folder and searchstring
    async ResetFilters() {
        document.getElementById("input_text_safe_search").value = "";
        this.props.SetSearchString("");
        this.props.SetSelectedFolder(null);
    }
}
