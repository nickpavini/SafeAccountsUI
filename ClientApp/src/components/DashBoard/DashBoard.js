import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from './SafeSideBar/SafeSideBar';

export class DashBoard extends Component {
    render() {
        let props = this.props;
        const RenderSafeSideBar = () => {
            if (props.device_mode == 1)
                return <SafeSideBar SetSearchString={this.props.SetSearchString} Folders={this.props.folders} SetSelectedFolder={this.props.SetSelectedFolder} />
        }

        return (
            <div class="div_dashboard">
                {RenderSafeSideBar()}
                <Safe safe={this.props.safe} searchString={this.props.searchString} selectedFolderID={this.props.selectedFolderID} />
            </div>
        );
    }
}