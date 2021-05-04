import React, { Component } from 'react';
import './SearchBar.css';

export class SearchBar extends Component {
    constructor(props) {
        super(props);

        //bind functions
        this.SearchStringChanged = this.SearchStringChanged.bind(this);
    }

    render() {
        return (
            <div class="SearchBar">
                <textarea maxLength="15" id="input_text_safe_search" onInput={this.SearchStringChanged} rows="1" placeholder="Search Safe"></textarea>
            </div>
        );
    }

    // update the search string to update view
    async SearchStringChanged(event) {
        this.props.SetSearchString(event.target.value)
    }
}
