import React, { Component } from 'react';
import { faFolder, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Encrypt } from '../../HelperFunctions.js'
import { AttempRefresh, SetSelectedFolder, UpdateSingleFolder, SetFolderParent, SetItemFolder, OpenFolderContextMenu } from '../../HelperFunctions.js'
import './Folder.css';

export class Folder extends Component {
    static displayName = Folder.name;

    constructor(props) {
        super(props);

        // function bindings
        this.SelectFolder = this.SelectFolder.bind(this);
        this.Drag = this.Drag.bind(this);
        this.Drop = this.Drop.bind(this);
        this.BlurName = this.BlurName.bind(this);
        this.SetFolderName = this.SetFolderName.bind(this);
    }

    componentDidMount() {
        document.getElementById("div_folder_" + this.props.folder.id.toString()).addEventListener('contextmenu', e => {
            e.preventDefault();
            OpenFolderContextMenu(this.props.folder.id, e.pageX + "px", e.pageY + "px", this.props.SetAppState);
        });
    }

    render() {
        var fold_id = "div_folder_" + this.props.folder.id; // id for the clickable div tag
        var span_id = "span_folder_" + this.props.folder.id + "_name"; // id of span for when we want it editable

        return (
            <div key={this.props.folder.id} id={fold_id} className="div_folder" onClick={this.SelectFolder} draggable="true" onDragStart={this.Drag} onDrop={this.Drop} onDragOver={this.AllowDrop} >
                <FontAwesomeIcon icon={this.props.AppState.selectedFolderID === this.props.folder.id ? faFolderOpen : faFolder} style={{ color: "white" }} />
                <span className="span_folder_name" id={span_id} onBlur={this.BlurName}>{this.props.folder.folderName}</span>
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

        SetSelectedFolder(parseInt(fold_id), this.props.SetAppState);
    }

    Drag(event) {
        event.dataTransfer.setData("folder", JSON.stringify(this.props.folder)); // send the entire safeitem
    }

    // makes it so hovering item can be dropped
    AllowDrop(event) {
        event.preventDefault();
    }

    Drop(event) {
        event.preventDefault();

        // if the dropped element is a safe item, we set that item to be associated with this folder
        if (event.dataTransfer.getData("safeitem") !== "") {
            SetItemFolder(JSON.parse(event.dataTransfer.getData("safeitem")), this.props.folder.id, this.props.AppState, this.props.SetAppState);
        }
        // if the dropped element is a folder, then we update that folders parent to be this folder
        else if (event.dataTransfer.getData("folder") !== "") {
            SetFolderParent(JSON.parse(event.dataTransfer.getData("folder")), this.props.folder.id, this.props.AppState, this.props.SetAppState)
        }
    }

    BlurName() {
        // if the element wasnt being edited then we just return
        if (document.getElementById("span_folder_" + this.props.folder.id + "_name").attributes.getNamedItem("contentEditable") === "false")
            return;

        // set it no longer editable, remove the event listener for enter key, and get the current folder name
        document.getElementById("span_folder_" + this.props.folder.id + "_name").setAttribute("contentEditable", "false");
        var folderName = document.getElementById("span_folder_" + this.props.folder.id + "_name").innerHTML;

        // check for name change, and set as needed
        if (folderName !== this.props.folder.folderName) {

            this.SetFolderName(folderName);
        }
    }

    // api call to change the folders name
    async SetFolderName(newName) {
        // aes encrypt the name
        var newNameEncrypted = Encrypt(newName);

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: "\"" + newNameEncrypted + "\"",
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/folders/' + this.props.folder.id + '/name', requestOptions);
        if (response.ok) {
            this.props.folder.folderName = newName;
            UpdateSingleFolder(this.props.folder, this.props.AppState.folders, this.props.SetAppState)
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.SetFolderName(newName); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            document.getElementById("span_folder_" + this.props.folder.id + "_name").innerHTML = this.props.folder.folderName; // reset name if the api call failed
        }
    }
}
