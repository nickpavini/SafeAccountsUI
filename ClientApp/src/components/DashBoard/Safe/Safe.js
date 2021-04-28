import React, { Component } from 'react';
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
            <div class="div_safe">
                <div class="div_safe_options">
                    <label id="lbl_safe">Safe</label>
                    <button id="btn_add_account"><b>+</b>Add Item</button>
                    <button id="btn_item_settings">&#9881;</button>
                </div>
                {
                    this.props.safe.map((value, index) => {
                        // display the account if its folder matches, or the selected folder is null  or empty then we display all
                        if (value.FolderID == this.props.selectedFolderID || this.props.selectedFolderID == null) {
                            if (value.Title.includes(this.props.searchString) || this.props.searchString == null)
                                return (
                                    <SafeItem info={value} UpdateSelectedItems={this.UpdateSelectedItems}/>
                                );
                        }
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
