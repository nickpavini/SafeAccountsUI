import React, { Component } from 'react';
import './Safe.css';
import { SafeItem } from './SafeItem/SafeItem';
import { SelectedItemsMenu } from './SelectedItemsMenu/SelectedItemsMenu';
import { SafeItemContextMenu } from './SafeItem/SafeItemContextMenu/SafeItemContextMenu';
import { faSquare, faStar, faCaretSquareDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBar } from '../../SearchBar/SearchBar';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { Redirect } from 'react-router-dom';

export class Safe extends Component {
    static displayName = Safe.name;

    constructor(props) {
        super(props);

         // set to hold the ids of which items are currently selected
        this.state = {
            selectedItems: new Set(), openSelectedItemsMenu: false, openContextMenu: false,
            menu_top: "0px", menu_left: "0px", menu_item_id: null,
            redirect: false, toUrl: null
        }; 

        // function binding
        this.UpdateSelectedItems = this.UpdateSelectedItems.bind(this);
        this.OpenSelectedItemsMenu = this.OpenSelectedItemsMenu.bind(this);
        this.CloseSelectedItemsMenu = this.CloseSelectedItemsMenu.bind(this);
        this.OpenContextMenu = this.OpenContextMenu.bind(this);
        this.CloseContextMenu = this.CloseContextMenu.bind(this);
        this.AddSafeItem = this.AddSafeItem.bind(this);
    }

    // if props have changed, we need to update items selected
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props)
            this.setState({ selectedItems: new Set() });
        return true;
    }

    render() {

        //check for redirect
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />

        const RenderSafeItemContextMenu = () => {
            if (this.state.openContextMenu)
                return <SafeItemContextMenu uid={this.props.uid} item={this.props.safe.find(e => e.id === this.state.menu_item_id)} FetchSafe={this.props.FetchSafe} top={this.state.menu_top} left={this.state.menu_left} CloseContextMenu={this.CloseContextMenu} attemptRefresh={this.props.attemptRefresh}/>;
        }

        const RenderSearchBar = () => {
            if (this.props.device_mode === localStorage.getItem("MOBILE_MODE"))
                return <SearchBar SetSearchString={this.props.SetSearchString} />;
        }

        const RenderTableHeaderSquare = () => {
            if (this.state.selectedItems.size > 0)
                return <td><FontAwesomeIcon id="icon_safeitem_dropdown" icon={faCaretSquareDown} onClick={this.OpenSelectedItemsMenu}/></td>
            else
                return <td><FontAwesomeIcon id="icon_safeitem_square" icon={faSquare} style={{ color: "white" }} /></td>
        }

        // drop down menu for when 1 or more items have been selected by the checkbox
        const RenderSelectedItemsMenu = () => {
            if (this.state.openSelectedItemsMenu)
                return <SelectedItemsMenu uid={this.props.uid} selectedItems={this.state.selectedItems} top={this.state.menu_top} left={this.state.menu_left} CloseSelectedItemsMenu={this.CloseSelectedItemsMenu} />;
        }

        return (
            <div className="div_safe">
                {RenderSafeItemContextMenu()}
                <div id="title_and_options">
                    <span id="span_safe_title">Password List</span>
                    {RenderSearchBar()}
                    <FontAwesomeIcon id="icon_safeitem_plus" icon={faPlusSquare} style={{ color: "white" }} onClick={this.AddSafeItem}/>
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
                                {this.props.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td>URL</td> : null}
                                {this.props.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td>Last Modified</td> : null}
                            </tr>
                        </thead>
                        <tbody id="tb_safeitems">
                            {
                                this.props.safe.map((value, index) => {
                                    // if favorites are selected, we dont worry about the folders or the search string
                                    if (this.props.showFavorites) {
                                        if (value.isFavorite)
                                            return <SafeItem key={value.id} uid={this.props.uid} device_mode={this.props.device_mode} info={value} checked={this.state.selectedItems.has(value.id.toString())} UpdateSelectedItems={this.UpdateSelectedItems} OpenContextMenu={this.OpenContextMenu} />;
                                    }
                                    // display the account if its folder matches, or the selected folder is null  or empty then we display all
                                    else if (value.folderID === this.props.selectedFolderID || this.props.selectedFolderID === null) {
                                        // match search string
                                        if (this.props.searchString === null || value.title.toLowerCase().includes(this.props.searchString.toLowerCase()))
                                            return <SafeItem key={value.id} uid={this.props.uid} device_mode={this.props.device_mode} info={value} checked={this.state.selectedItems.has(value.id.toString())} UpdateSelectedItems={this.UpdateSelectedItems} OpenContextMenu={this.OpenContextMenu} />;
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

    async UpdateSelectedItems(id) {
        var items = this.state.selectedItems;

        // if the id exists, than we are unselecting it, else we are adding it to the selection
        if (this.state.selectedItems.has(id))
            items.delete(id);
        else
            items.add(id);

        // update state
        this.setState({ selectedItems: items });
    }

    async OpenSelectedItemsMenu() {
        this.setState({ openSelectedItemsMenu: true })
    }

    async CloseSelectedItemsMenu() {
        this.setState({ openSelectedItemsMenu: false });
    }

    async OpenContextMenu(item_id, left, top) {
        this.setState({ openContextMenu: true, menu_top: top, menu_left: left, menu_item_id: item_id })
    }

    async CloseContextMenu() {
        this.setState({ openContextMenu: false });
    }

    AddSafeItem() {
        this.setState({ redirect: true, toUrl: '/safeitems/add' })
    }
}
