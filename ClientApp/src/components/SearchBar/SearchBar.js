import React, { Component } from 'react';
import { SetSearchString } from '../HelperFunctions.js'
import './SearchBar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

export class SearchBar extends Component {
    constructor(props) {
        super(props);

        //bind functions
        this.SearchStringChanged = this.SearchStringChanged.bind(this);
    }

    render() {
        return (
            <div id="div_searchbar">
                <div id="div_search_container">
                <input type="text" maxLength="15" id="input_text_safe_search" onInput={this.SearchStringChanged} placeholder="Search Safe"></input>
                    <FontAwesomeIcon id="icon_search" icon={faSearch} />
                </div>
            </div>
        );
    }

    // update the search string to update view
    async SearchStringChanged(event) {
        SetSearchString(event.target.value, this.props.SetAppState);
    }
}
