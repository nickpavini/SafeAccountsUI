import React, { Component } from 'react';
import './Safe.css';
import { SafeItem } from './SafeItem/SafeItem';
import { SelectedItemsMenu } from './SelectedItemsMenu/SelectedItemsMenu';
import { SafeItemContextMenu } from './SafeItem/SafeItemContextMenu/SafeItemContextMenu';
import { faSquare, faStar, faCaretSquareDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBar } from '../../SearchBar/SearchBar';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import { OpenSelectedItemsMenu, OpenImportExportMenu } from '../../HelperFunctions.js'

export class Safe extends Component {
    static displayName = Safe.name;

    constructor(props) {
        super(props);

         // set to hold the ids of which items are currently selected
        this.state = {
            redirect: false, toUrl: null
        }; 

        // function binding
        this.AddSafeItem = this.AddSafeItem.bind(this);
    }

    render() {

        //check for redirect
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />

        const RenderSafeItemContextMenu = () => {
            if (this.props.AppState.openSafeItemContextMenu)
                return <SafeItemContextMenu
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                    item={this.props.AppState.safe.find(e => e.id === this.props.AppState.menu_item_id)}
                />;
        }

        const RenderSearchBar = () => {
            if (this.props.AppState.device_mode === localStorage.getItem("MOBILE_MODE"))
                return <SearchBar SetAppState={this.props.SetAppState} />;
        }

        const RenderTableHeaderSquare = () => {
            if (this.props.AppState.selectedItems.size > 0)
                return <td><FontAwesomeIcon id="icon_safeitem_dropdown" icon={faCaretSquareDown} onClick={() => OpenSelectedItemsMenu(this.props.SetAppState)}/></td>
            else
                return <td><FontAwesomeIcon id="icon_safeitem_square" icon={faSquare} style={{ color: "white" }} /></td>
        }

        // drop down menu for when 1 or more items have been selected by the checkbox
        const RenderSelectedItemsMenu = () => {
            if (this.props.AppState.openSelectedItemsMenu)
                return <SelectedItemsMenu
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                />
        }

        return (
            <div className="div_safe">
                {RenderSafeItemContextMenu()}
                <div id="title_and_options">
                    <span id="span_safe_title">Password List</span>
                    {RenderSearchBar()}
                    <FontAwesomeIcon id="icon_safeitem_plus" icon={faPlusSquare} style={{ color: "white" }} onClick={this.AddSafeItem}/>
                    <FontAwesomeIcon id="icon_safeitem_export" icon={faDownload} style={{ color: "white" }} onClick={() => OpenImportExportMenu(this.props.SetAppState)}/>
                </div>
                <div className="div_safeitems">
                    {RenderSelectedItemsMenu()}
                    <table style={{width: "100%"}}>
                        <thead>
                            <tr id="tr_safeitem_labels">
                                {RenderTableHeaderSquare()}
                                <td><FontAwesomeIcon id="icon_safeitem_title_star" icon={faStar} style={{ color: "white" }} /></td>
                                <td>Title</td>
                                <td>Username</td>
                                <td>Password</td>
                                {this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td>URL</td> : null}
                                {this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td>Last Modified</td> : null}
                            </tr>
                        </thead>
                        <tbody id="tb_safeitems">
                            {
                                this.props.AppState.safe.map((value, index) => {
                                    // if favorites are selected, we dont worry about the folders or the search string
                                    if (this.props.AppState.showFavorites) {
                                        if (value.isFavorite)
                                            return <SafeItem
                                                key={value.id}
                                                AppState={this.props.AppState}
                                                SetAppState={this.props.SetAppState}
                                                info={value}
                                                checked={this.props.AppState.selectedItems.has(value.id)}
                                            />;
                                    }
                                    // display the account if its folder matches, or the selected folder is null  or empty then we display all
                                    else if (value.folderID === this.props.AppState.selectedFolderID || this.props.AppState.selectedFolderID === null) {
                                        // match search string
                                        if (this.props.AppState.searchString === null || value.title.toLowerCase().includes(this.props.AppState.searchString.toLowerCase()))
                                            return <SafeItem
                                                key={value.id}
                                                AppState={this.props.AppState}
                                                SetAppState={this.props.SetAppState}
                                                info={value}
                                                checked={this.props.AppState.selectedItems.has(value.id)}
                                            />;
                                    }

                                    return null; // retun null if nothing
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    AddSafeItem() {
        this.setState({ redirect: true, toUrl: '/safeitems/add' })
    }
}
