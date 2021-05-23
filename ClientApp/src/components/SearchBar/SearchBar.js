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
            <div className="SearchBar">
                <input type="text" maxLength="15" id="input_text_safe_search" onInput={this.SearchStringChanged} placeholder="Search Safe"></input>
            </div>
        );
    }

    // update the search string to update view
    async SearchStringChanged(event) {
        this.props.SetSearchString(event.target.value)
    }
}
