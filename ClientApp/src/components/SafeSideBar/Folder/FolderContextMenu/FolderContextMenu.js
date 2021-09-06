import React, { Component } from 'react';
import { DeleteFolder, AddFolder, CloseFolderContextMenu } from '../../../HelperFunctions.js'
import './FolderContextMenu.css';

export class FolderContextMenu extends Component {
    constructor(props) {
        super(props);

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.RenameFolder = this.RenameFolder.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    // unrender if we click away
    async handleClick(e) {
        CloseFolderContextMenu(this.props.SetAppState);
    }

    render() {
        // menu options
        return (
            <div id="menu_folder" style={{ top: this.props.AppState.menu_top, left: this.props.AppState.menu_left }}>
                <span className="menu_folder" id="menu_folder_add" onClick={() => AddFolder(this.props.AppState, this.props.SetAppState)}>Add Folder</span><br />
                <span className="menu_folder" id="menu_folder_edit" onClick={this.RenameFolder}>Rename Folder</span><br />
                <span className="menu_folder" id="menu_folder_delete" onClick={() => DeleteFolder(this.props.AppState, this.props.SetAppState, this.props.folder)}>Delete Folder</span><br />
            </div>
        );
    }

    // rename the folder.
    RenameFolder() {
        // make editable and then select and focus.. also add listener for enter button to blur
        document.getElementById("span_folder_" + this.props.folder.id + "_name").setAttribute("contentEditable", "true");
        document.getElementById("span_folder_" + this.props.folder.id + "_name").focus();
        document.getElementById("span_folder_" + this.props.folder.id + "_name").addEventListener("keypress", function (e) {
            if (e.keyCode === 13) {
                this.blur();
            }
        });
    }
}
