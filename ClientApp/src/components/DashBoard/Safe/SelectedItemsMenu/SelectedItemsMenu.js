import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SelectedItemsMenu.css';

export class SelectedItemsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, isFirstRender: true
        };

        // function bindings
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    render() {
        // redirect if needed
        if (this.state.redirect)
            return <Redirect to='/account' />

        // menu options
        return (
            <div id="menu_selected_items" >
                <span className="menu_selected_items" id="" onClick={null}>Delete Items</span><br />
                <span className="menu_selected_items" id="" onClick={null}>Move To {'>'}</span><br />
            </div>
        );
    }

    // unrender if we click away
    async handleClick(e) {
        // dont close if the icon was clicked.. this menu is getting closed up first open
        if (this.state.isFirstRender) {
            this.setState({isFirstRender: false});
            return;
        }

        this.props.CloseSelectedItemsMenu();
    }
}
