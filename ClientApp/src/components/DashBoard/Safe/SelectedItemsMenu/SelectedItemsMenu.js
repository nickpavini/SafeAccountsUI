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

        this.props.CloseSelectedItemsMenu();
    }

    // DELETE multiple items from the safe
    async DeleteMultipleItems() {
        // HTTP request options
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify(Array.from(this.props.selectedItems)),
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.uid + '/accounts', requestOptions);
        if (response.ok) {
            var updatedSafe = this.props.safe;
            this.props.selectedItems.forEach(e => {
                var indexToDelete = this.props.safe.findIndex(f => f.id.toString() === e)
                if (indexToDelete > -1) {
                    updatedSafe.splice(indexToDelete, 1);
                }
                else {
                    /*
                        Here we might need an error catcher
                     */
                }
            });
            this.props.UpdateSafe(updatedSafe);
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var refreshSucceeded = await this.props.attemptRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (!refreshSucceeded)
                return;

            this.DeleteMultipleItems(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {

        }
    }
}
