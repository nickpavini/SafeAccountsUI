import React, { Component } from 'react';
import { CloseImportExportMenu, EncryptFolders, EncryptSafe, Encrypt, Decrypt, AddFolder, PostSafeItem, UpdateSafeItem, DeleteFolder, DeleteMultipleItems } from '../../../HelperFunctions.js'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ImportExportMenu.css';

export class ImportExportMenu extends Component {
    constructor(props) {
        super(props);

        this.Export = this.Export.bind(this);
        this.Import = this.Import.bind(this);
        this.AddImportedFolders = this.AddImportedFolders.bind(this);
        this.AddImportedSafe = this.AddImportedSafe.bind(this);
        this.DeleteEverything = this.DeleteEverything.bind(this);
    }

    render() {
        
        return (
            <div id="import_export_menu">
                <FontAwesomeIcon id="icon_close_import_menu" icon={faTimes} onClick={() => CloseImportExportMenu()} />
                <div id="import_export_container">
                    <div id="import_export_content">
                        <input type="file" id="file_input" accept=".sae" onChange={this.Import} />
                        <div className="menu_import_export" id="div_import_passwords_menu_option" onClick={() => document.getElementById("file_input").click()}>Import</div>
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

    // here will want to decrypt everything and then check if the IDs match any existing items
    // we will only add items that are not existing in the current safe online
    async Import(e) {
        if (!window.confirm("Warning! This will delete all of your current data and replace it with the backup you are choosing.\n\nClick OK to continue, cancel to exit."))
            return;

        // grab file and check for existence
        var file = e.target.files[0];
        if (!file)
            return;

        // grab file contents and decrypt
        const contents = await new Response(file).text();
        if (contents === "")
            return;

        const decryptedContents = Decrypt(contents);
        var safeAndFolders = decryptedContents.split("\n"), index = 0;

        var itemsToAdd = []; // array of safeitems to add
        var foldersToAdd = []; // array of folders to add

        index = this.ParseImportedFolders(safeAndFolders, index, foldersToAdd);
        index += 1; // skip the seperator between folders and safe items
        this.ParseImportedSafe(safeAndFolders, index, itemsToAdd);

        // lets not delete everything if we didnt get anything parsed out..
        // In theory this shouldnt ever happen I think
        if (foldersToAdd.length === 0 && itemsToAdd.length === 0)
            return;

        // just before adding everything to our DB server, we need to delete all current data
        // other wise we will not be able to find the accounts that should be gone
        await this.DeleteEverything();

        // now we need to add the folders and items to the database on the server
        const [folderDictionary, safeDictionary] = this.GenerateHashMaps(foldersToAdd, itemsToAdd);
        await this.AddImportedFolders(foldersToAdd, folderDictionary, safeDictionary);
        await this.AddImportedSafe(itemsToAdd);
    }

    ParseImportedFolders(safeAndFolders, index, foldersToAdd) {
        // grab folders
        while (safeAndFolders[index] !== "") {
            var folderArr = safeAndFolders[index].split(" ");

            // create folder and add to array
            var folder = {
                id: parseInt(folderArr[0]),
                folderName: folderArr[1],
                parentID: folderArr[2] === "null" ? null : parseInt(folderArr[2]),
                hasChild: folderArr[3] === "true" ? true : false
            };
            foldersToAdd.push(folder);
            index += 1;
        }

        return index;
    }

    ParseImportedSafe(safeAndFolders, index, itemsToAdd) {
        // grab safe
        while (index < safeAndFolders.length - 1) {
            var safeArr = safeAndFolders[index].split(" ");

            // create safe item and add to array
            var item = {
                id: parseInt(safeArr[0]),
                title: safeArr[1],
                login: safeArr[2],
                password: safeArr[3],
                url: safeArr[4],
                description: safeArr[5],
                folderID: safeArr[6] === "null" ? null : parseInt(safeArr[6]),
                isFavorite: safeArr[7] === "true" ? true : false
            };
            itemsToAdd.push(item);
            index += 1;
        }

        return index;
    }

    // deletes all the users folders and safe items
    async DeleteEverything() {
        for (var folder of this.props.AppState.folders) {
            // we only have to delete the top level folders because it will delete anything else that is a child
            if (folder.parentID === null)
                await DeleteFolder(this.props.AppState, this.props.SetAppState, folder);
        }

        // folders are gone and that got rid of some accounts too, so lets clear the rest
        var itemsToDelete = new Set();
        for (var item of this.props.AppState.safe) {
            itemsToDelete.add(item.id); // add all item ids to the set to be deleted
        }
        this.props.SetAppState({ selectedItems: itemsToDelete }); // update selected items with our items to delete
        await DeleteMultipleItems(this.props.AppState, this.props.SetAppState); // delete the items
    }

    GenerateHashMaps(foldersToAdd, itemsToAdd) {
        // generate hashmap of parent IDs and folders that are not null
        var folderDictionary = {};
        for (var folder of foldersToAdd) {
            if (folder.parentID !== null) {
                if (folder.parentID in folderDictionary)
                    folderDictionary[folder.parentID].push(folder);
                else
                    folderDictionary[folder.parentID] = [folder];
            }
        }

        // generate hashmap of folder IDs and safe items that are not null
        var safeDictionary = {};
        for (var item of itemsToAdd) {
            if (item.folderID !== null) {
                if (item.folderID in safeDictionary)
                    safeDictionary[folder.parentID].push(item);
                else
                    safeDictionary[item.folderID] = [item];
            }
        }

        return [folderDictionary, safeDictionary]; // return both hashmaps
    }

    async AddImportedFolders(foldersToAdd, folderDictionary, safeDictionary) {
        // first we do folders
        for (var folder of foldersToAdd) {
            // we need to add the folder and then update anything that referenced the old ID
            var newFolderID = await AddFolder(this.props.AppState, this.props.SetAppState, true, { folderName: Decrypt(folder.folderName), parentID: folder.parentID });

            // only modify other stuff if call was successful.. we will need to add what happens upon failure
            if (newFolderID !== -1) {
                // there are other folders whose parent was the old folder id, lets update their parent id
                if (folder.id in folderDictionary) {
                    for (var folderToUpdate of folderDictionary[folder.id]) {
                        folderToUpdate.parentID = newFolderID;
                    }
                }

                if (folder.id in safeDictionary) {
                    for (var itemToUpdate of safeDictionary[folder.id]) {
                        itemToUpdate.folderID = newFolderID
                    }
                }
            }
        }
    }

    async AddImportedSafe(itemsToAdd) {
        // now lets add the safe items with the corresponding folders
        for (var item of itemsToAdd) {
            var retItem = await PostSafeItem(item, this.props.AppState);

            if (retItem !== -1) {
                // set unencrypted values now so that we can update the internal running safe
                retItem.title = Decrypt(item.title);
                retItem.login = Decrypt(item.login);
                retItem.password = Decrypt(item.password);
                retItem.url = Decrypt(item.url);
                retItem.description = Decrypt(item.description);

                // update the apps internal safe (decrypted)
                UpdateSafeItem(retItem, this.props.AppState.safe, this.props.SetAppState);
            }
        }
    }
}
