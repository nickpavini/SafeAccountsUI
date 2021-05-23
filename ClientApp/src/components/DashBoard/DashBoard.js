import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from '../SafeSideBar/SafeSideBar';
import { SearchBar } from '../SearchBar/SearchBar';

export class DashBoard extends Component {
    render() {
        const RenderSafeSideBar = () => {
            if (this.props.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SafeSideBar device_mode={this.props.device_mode} SetSearchString={this.props.SetSearchString} Folders={this.props.folders} SetSelectedFolder={this.props.SetSelectedFolder} />;
            else
                return <SearchBar SetSearchString={this.props.SetSearchString} />;
        }

        return (
            <div className="div_dashboard">
                {RenderSafeSideBar()}
                <Safe safe={this.props.safe} searchString={this.props.searchString} selectedFolderID={this.props.selectedFolderID} />
            </div>
        );
    }
}