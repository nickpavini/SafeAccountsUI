import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from './SafeSideBar/SafeSideBar';

export class DashBoard extends Component { }

export class DesktopDashBoard extends Component {
    render() {
        return (
            <div class="div_dashboard">
                <SafeSideBar SetSearchString={this.props.SetSearchString} Folders={this.props.folders} SetSelectedFolder={this.props.SetSelectedFolder} />
                <Safe safe={this.props.safe} searchString={this.props.searchString} selectedFolderID={this.props.selectedFolderID} />
            </div>
        );
    }
}

// in tablet mode and mobile mode we have the sidebar on the navmenu
export class MobileDashBoard extends Component {
    render() {
        return (
            <div class="div_dashboard">
                <Safe safe={this.props.safe} searchString={this.props.searchString} selectedFolderID={this.props.selectedFolderID} />
            </div>
        );
    }
}
