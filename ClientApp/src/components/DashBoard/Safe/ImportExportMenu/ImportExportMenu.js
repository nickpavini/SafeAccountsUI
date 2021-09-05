import React, { Component } from 'react';
import { CloseImportExportMenu } from '../../../HelperFunctions.js'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ImportExportMenu.css';

export class ImportExportMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div id="import_export_menu">
                <FontAwesomeIcon id="icon_close_import_menu" icon={faTimes} onClick={() => CloseImportExportMenu()} />
                <div id="import_export_container">
                    <div id="import_export_content">
                        <div className="menu_import_export" id="div_import_passwords_menu_option" onClick={null}>Import</div>
                        <div className="menu_import_export" id="div_export_passwords_menu_option" onClick={null}>Export</div>
                    </div>
                </div>
            </div>
        );
    }
}
