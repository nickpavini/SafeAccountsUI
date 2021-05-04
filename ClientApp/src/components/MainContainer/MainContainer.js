import React, { Component } from 'react';
import './MainContainer.css';

export class MainContainer extends Component {
    render() {
        return (
            <div class="main_container">
                {this.props.children}
            </div>
         );
    }
}
