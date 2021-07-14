import React, { Component } from 'react';
import { SetSearchString } from '../HelperFunctions.js'
import './SearchBar.css';

export class SearchBar extends Component {
    constructor(props) {
        super(props);

        //bind functions
        this.SearchStringChanged = this.SearchStringChanged.bind(this);
    }

    render() {
        return (
            <div id="div_searchbar">
                <input type="text" maxLength="15" id="input_text_safe_search" onInput={this.SearchStringChanged} placeholder="Search Safe"></input>
            </div>
        );
    }

    // update the search string to update view
    async SearchStringChanged(event) {
        SetSearchString(event.target.value, this.props.SetAppState);
    }
}
