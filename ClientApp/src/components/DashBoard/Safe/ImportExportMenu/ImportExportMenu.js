import React, { Component } from 'react';
import { AttempRefresh, CloseImportExportMenu } from '../../../HelperFunctions.js'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ImportExportMenu.css';

export class ImportExportMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <div id="import_export_menu">
                <div id="import_export_container">
                    <span onClick={() => CloseImportExportMenu()}>&times;</span>
                    <div className="menu_import_export" id="" onClick={null}>Delete Items</div>
                    <div className="menu_import_export" id="" onClick={null}>Move To {'>'}</div>
                </div>
            </div>
        );
    }
}
