import React, { Component } from 'react';
import { faFolder, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Folder.css';

export class Folder extends Component {
    static displayName = Folder.name;

    constructor(props) {
        super(props);

        // function bindings
        this.SelectFolder = this.SelectFolder.bind(this);
        this.SetItemFolder = this.SetItemFolder.bind(this);
        this.Drop = this.Drop.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        var fold_id = "div_folder_" + this.props.folder.id; // id for the clickable div tag

        return (
            <div key={this.props.folder.id} id={fold_id} className="div_folder" onClick={this.SelectFolder} onDrop={this.Drop} onDragOver={this.AllowDrop} >
                <FontAwesomeIcon icon={this.props.selectedFolderID === this.props.folder.id ? faFolderOpen : faFolder} style={{ color: "white" }} />
                <span className="span_folder_name">{this.props.folder.folderName}</span>
            </div>
        );
    }

    // function to set selected folder and update what the safe is displaying
    async SelectFolder(event) {
        var fold_id = event.currentTarget.id.replace("div_folder_", "");

        // show or hide children as needed.. logic is opposite because the state is changed after the function call.
        if (this.props.folder.hasChild) {
            document.getElementById("div_folder_" + this.props.folder.id + "_child").style.display = document.getElementById("div_folder_" + this.props.folder.id + "_child").style.display === "block" ? "none" : "block";
        }

        this.props.SetSelectedFolder(parseInt(fold_id));
    }

    // makes it so hovering item can be dropped
    AllowDrop(event) {
        event.preventDefault();
    }

    Drop(event) {
        event.preventDefault();
        var safeitem = event.dataTransfer.getData("safeitem");

        // if the dropped element is a safe item, we set that item to be associated with this folder
        if (safeitem !== "") {
            this.SetItemFolder(JSON.parse(safeitem));
        }
    }

    async SetItemFolder(safeitem) {
        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: this.props.folder.id,
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch('https://localhost:44366/users/' + this.props.uid + '/accounts/' + safeitem.id + '/folder', requestOptions);
        if (response.ok) {
            safeitem.folderID = this.props.folder.id;
            this.props.UpdateSafeItem(safeitem); // later we may want to do this before the call, and just re-update if the call fails.. it will speed up responsiveness
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.SetItemFolder(safeitem); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
        }
    }
}
