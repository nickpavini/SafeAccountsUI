import React, { Component } from 'react';
import { CloseImportExportMenu, EncryptFolders, EncryptSafe, Encrypt } from '../../../HelperFunctions.js'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ImportExportMenu.css';

export class ImportExportMenu extends Component {
    constructor(props) {
        super(props);

        this.Export = this.Export.bind(this);
    }

    render() {
        
        return (
            <div id="import_export_menu">
                <FontAwesomeIcon id="icon_close_import_menu" icon={faTimes} onClick={() => CloseImportExportMenu()} />
                <div id="import_export_container">
                    <div id="import_export_content">
                        <div className="menu_import_export" id="div_import_passwords_menu_option" onClick={null}>Import</div>
                        <div className="menu_import_export" id="div_export_passwords_menu_option" onClick={this.Export}>Export</div>
                    </div>
                </div>
            </div>
        );
    }

    // Function to download encrypted data to a file .sae (safe accounts export) file
    Export() {
        // lets make encrypted copies of our internal data
        var encryptedFolders = EncryptFolders(this.props.AppState.folders);
        var encryptedSafe = EncryptSafe(this.props.AppState.safe);

        // lets parse the encrypted data into 1 line strings to be put into a text file
        var data = "";
        encryptedFolders.map((value, index) => {
            data += value.id.toString() + " ";
            data += value.folderName + " ";
            data += value.parentID === null ? "null " : value.parentID.toString() + " ";
            data += value.hasChild.toString() + "\n";
            return null;
        });
        data += "\n"; // space between folders and accounts
        encryptedSafe.map((value, index) => {
            data += value.id.toString() + " ";
            data += value.title + " ";
            data += value.login + " ";
            data += value.password + " ";
            data += value.url + " ";
            data += value.description + " ";
            data += value.folderID === null ? "null " : value.folderID.toString() + " ";
            data += value.isFavorite.toString() + "\n";
            return null;
        });

        // one final encryption so that we avoid showing any relationships
        data = Encrypt(data);

        // create a new text blob
        var file = new Blob([data], { type: "text/html" });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, "safeaccounts.sae");
        else { // Others
            // create anchor tag linking to the blob
            var a = document.createElement("a");
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = "safeaccounts.sae";

            //add the anchor, click and and delete it
            document.body.appendChild(a);
            a.click(); //
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
}
