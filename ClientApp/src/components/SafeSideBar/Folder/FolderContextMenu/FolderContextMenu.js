import React, { Component } from 'react';
import { DecryptFolders, DecryptSafe, AttempRefresh, AddFolder, CloseFolderContextMenu } from '../../../HelperFunctions.js'
import './FolderContextMenu.css';

export class FolderContextMenu extends Component {
    constructor(props) {
        super(props);

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.RenameFolder = this.RenameFolder.bind(this);
        this.DeleteFolder = this.DeleteFolder.bind(this);
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
                <span className="menu_folder" id="menu_folder_delete" onClick={this.DeleteFolder}>Delete Folder</span><br />
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

    // DELETE the folder
    async DeleteFolder() {
        // HTTP request options
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_API_KEY,
                'AccessToken': window.localStorage.getItem("AccessToken")
            }
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/folders/' + this.props.folder.id.toString(), requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            var safeAndFolders = JSON.parse(responseText);
            this.props.SetAppState({ safe: DecryptSafe(safeAndFolders.safe) }) // update safe
            this.props.SetAppState({ folders: DecryptFolders(safeAndFolders.updatedFolders) }); // update the folders
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.DeleteFolder(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            
        }
    }
}
