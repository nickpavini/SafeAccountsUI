import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Safe.css';
import { SafeItem } from './SafeItem/SafeItem';

export class Safe extends Component {
    static displayName = Safe.name;

    constructor(props) {
        super(props);

        this.state = { selectedItems: new Set() }; // set to hold the ids of which items are currently selected

        // function binding
        this.UpdateSelectedItems = this.UpdateSelectedItems.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div className="div_safe">
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
                                    <SafeItem key={value.id} info={value} UpdateSelectedItems={this.UpdateSelectedItems}/>
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
}
