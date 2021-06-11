import React, { Component } from 'react';
import './Safe.css';
import { SafeItem } from './SafeItem/SafeItem';
import { SafeItemContextMenu } from './SafeItem/SafeItemContextMenu/SafeItemContextMenu';
import { faSquare, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBar } from '../../SearchBar/SearchBar';

export class Safe extends Component {
    static displayName = Safe.name;

    constructor(props) {
        super(props);

         // set to hold the ids of which items are currently selected
        this.state = {
            selectedItems: new Set(), openContextMenu: false,
            menu_top: "0px", menu_left: "0px", menu_item_id: null
        }; 

        // function binding
        this.UpdateSelectedItems = this.UpdateSelectedItems.bind(this);
        this.OpenContextMenu = this.OpenContextMenu.bind(this);
        this.CloseContextMenu = this.CloseContextMenu.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        const RenderSafeItemContextMenu = () => {
            if (this.state.openContextMenu)
                return <SafeItemContextMenu uid={this.props.uid} item={this.props.safe.find(e => e.id === this.state.menu_item_id)} FetchSafe={this.props.FetchSafe} top={this.state.menu_top} left={this.state.menu_left} CloseContextMenu={this.CloseContextMenu} attemptRefresh={this.props.attemptRefresh}/>;
        }

        const RenderSearchBar = () => {
            if (this.props.device_mode === localStorage.getItem("MOBILE_MODE"))
                return <SearchBar SetSearchString={this.props.SetSearchString} />;
        }

        return (
            <div className="div_safe">
                {RenderSafeItemContextMenu()}
                <div id="title_and_options"><span id="span_safe_title">Password List</span>{RenderSearchBar()}</div>
                <div className="div_safeitems">
                    <table style={{width: "100%"}}>
                        <thead>
                            <tr id="tr_safeitem_labels">
                                <td><FontAwesomeIcon id="icon_safeitem_square" icon={faSquare} style={{ color: "white" }} /></td>
                                <td><FontAwesomeIcon className="icon_safeitem_star" id="icon_safeitem_star" icon={faStar} style={{ color: "white" }} /></td>
                                <td>Title</td>
                                <td>Username</td>
                                <td>Password</td>
                                <td>URL</td>
                                <td>Last Modified</td>
                            </tr>
                        </thead>
                        <tbody id="tb_safeitems">
                            {
                                this.props.safe.map((value, index) => {
                                    // if favorites are selected, we dont worry about the folders or the search string
                                    if (this.props.showFavorites) {
                                        if (value.isFavorite)
                                            return <SafeItem key={value.id} uid={this.props.uid} info={value} UpdateSelectedItems={this.UpdateSelectedItems} OpenContextMenu={this.OpenContextMenu} />;
                                    }
                                    // display the account if its folder matches, or the selected folder is null  or empty then we display all
                                    else if (value.folderID === this.props.selectedFolderID || this.props.selectedFolderID === null) {
                                        // match search string
                                        if (this.props.searchString === null || value.title.toLowerCase().includes(this.props.searchString.toLowerCase()))
                                            return <SafeItem key={value.id} uid={this.props.uid} info={value} UpdateSelectedItems={this.UpdateSelectedItems} OpenContextMenu={this.OpenContextMenu} />;
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

    async OpenContextMenu(item_id, left, top) {
        this.setState({ openContextMenu: true, menu_top: top, menu_left: left, menu_item_id: item_id })
    }

    async CloseContextMenu() {
        this.setState({ openContextMenu: false });
    }
}
