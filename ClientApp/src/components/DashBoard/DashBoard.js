import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from '../SafeSideBar/SafeSideBar';

export class DashBoard extends Component {
    render() {
        const RenderSafeSideBar = () => {
            if (this.props.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SafeSideBar device_mode={this.props.device_mode} SetSearchString={this.props.SetSearchString} Folders={this.props.folders} selectedFolderID={this.props.selectedFolderID} SetSelectedFolder={this.props.SetSelectedFolder} />;
        }

        return (
            <div className="div_dashboard">
                {RenderSafeSideBar()}
                <Safe uid={this.props.uid} device_mode={this.props.device_mode} safe={this.props.safe} FetchSafe={this.props.FetchSafe} searchString={this.props.searchString} SetSearchString={this.props.SetSearchString} selectedFolderID={this.props.selectedFolderID} attemptRefresh={this.props.attemptRefresh}/>
            </div>
        );
    }
}