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
    }

    componentDidMount() {
        
    }

    render() {
        var fold_id = "div_folder_" + this.props.folder.id; // id for the clickable div tag

        return (
            <div key={this.props.folder.id} id={fold_id} onClick={this.SelectFolder} className="div_folder">
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
}
