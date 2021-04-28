import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from './SafeSideBar/SafeSideBar';

export class DashBoard extends Component {
    static displayName = DashBoard.name;

    constructor(props) {
        super(props);
        this.state = { safe: null, folders: null, searchString: null, selectedFolderID: null };

        // function bindings
        this.FetchSafe = this.FetchSafe.bind(this);
        this.FetchUserFolders = this.FetchUserFolders.bind(this);
        this.SetSearchString = this.SetSearchString.bind(this);
        this.SetSelectedFolder = this.SetSelectedFolder.bind(this);
    }

    componentDidMount() {
        this.FetchSafe(); // get accounts
        this.FetchUserFolders(); // get users folders
    }

    render() {
        var contents = null;

        // if any infor isnt done yet display loading for now
        if (this.state.safe === null || this.state.folders === null) {
            contents = <p>Loading...</p>;
        }
        else {
            // send props to safe and sidebar that are controlled by dashboard and re-render components as needed
            contents = (
                <div class="div_dashboard">
                    <SafeSideBar SetSearchString={this.SetSearchString} Folders={this.state.folders} SetSelectedFolder={this.SetSelectedFolder} />
                    <Safe safe={this.state.safe} searchString={this.state.searchString} selectedFolderID={this.state.selectedFolderID} />
                </div> 
            );
        }

        return contents;
    }

    //fetch all the users accounts.. may move this to safe, but for now we have it here to easily know whether to display loading or not
    async FetchSafe() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.props.uid + '/accounts';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ safe: JSON.parse(responseText).accounts })
        }
    }

    // get all the folders that the users has created
    async FetchUserFolders() {

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        const reqURI = 'https://eus-safeaccounts-test.azurewebsites.net/users/' + this.props.uid + '/folders';
        const response = await fetch(reqURI, requestOptions);
        if (response.ok) {
            const responseText = await response.text();
            this.setState({ folders: JSON.parse(responseText).folders })
        }
    }

    // call back for the sidebar to set search params for the safe
    SetSearchString(str) {
        this.setState({searchString: str});
    }

    // call back for the Folder component to set selected for the safe
    SetSelectedFolder(id) {
        this.setState({ selectedFolderID: id });
    }
}
