import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AttempRefresh, RemoveSafeItemLocally, CloseSelectedItemsMenu } from '../../../HelperFunctions.js'
import './SelectedItemsMenu.css';

export class SelectedItemsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, isFirstRender: true
        };

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.DeleteMultipleItems = this.DeleteMultipleItems.bind(this);
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
                <span className="menu_selected_items" id="" onClick={this.DeleteMultipleItems}>Delete Items</span><br />
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

        CloseSelectedItemsMenu(this.props.SetAppState);
    }

    // DELETE multiple items from the safe
    async DeleteMultipleItems(event) {
        // HTTP request options
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify(Array.from(this.props.AppState.selectedItems)),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/accounts', requestOptions);
        if (response.ok) {
            var updatedSafe = this.props.AppState.safe;
            this.props.AppState.selectedItems.forEach(e => {
                // if one fails to be removed, then we throw error... later we may want it to do fetchsafe as backup
                if (!RemoveSafeItemLocally(e, updatedSafe))
                    throw new Error({ code: 500, message: "Error: Could not remove item from safe locally"});
            });
            this.props.SetAppState({ safe: updatedSafe, selectedItems: new Set() });
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.DeleteMultipleItems(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
