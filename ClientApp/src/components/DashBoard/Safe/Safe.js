import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Safe.css';
import { SafeItem } from './SafeItem/SafeItem';
import { SafeItemContextMenu } from './SafeItem/SafeItemContextMenu/SafeItemContextMenu';

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
        this.OpenContenxtMenu = this.OpenContenxtMenu.bind(this);
        this.CloseContextMenu = this.CloseContextMenu.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        const RenderSafeItemContextMenu = () => {
            if (this.state.openContextMenu)
                return <SafeItemContextMenu item={this.props.safe.find(e => e.id === this.state.menu_item_id)} top={this.state.menu_top} left={this.state.menu_left} CloseContextMenu={this.CloseContextMenu}/>;
        }

        return (
            <div className="div_safe">
                {RenderSafeItemContextMenu()}
                <div className="div_safe_options">
                    <label id="lbl_safe">Safe</label>
                    <NavLink id="navlink_add_safe_item" tag={Link} to="/addsafeitem">+Add Item</NavLink>
                    <button id="btn_item_settings">&#9881;</button>
                </div>
                {
                    this.props.safe.map((value, index) => {
                        // display the account if its folder matches, or the selected folder is null  or empty then we display all
                        if (value.FolderID === this.props.selectedFolderID || this.props.selectedFolderID === null) {
                            if (this.props.searchString === null || value.title.toLowerCase().includes(this.props.searchString.toLowerCase()))
                                return (
                                    <SafeItem key={value.id} info={value} UpdateSelectedItems={this.UpdateSelectedItems} OpenContextMenu={this.OpenContenxtMenu}/>
                                );
                        }

                        return null; // retun null if nothing
                    }
                )}
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

    async OpenContenxtMenu(item_id, left, top) {
        this.setState({ openContextMenu: true, menu_top: top, menu_left: left, menu_item_id: item_id })
    }

    async CloseContextMenu() {
        this.setState({ openContextMenu: false });
    }
}
