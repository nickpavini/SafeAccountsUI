import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from '../SafeSideBar/SafeSideBar';

export class DashBoard extends Component {
    render() {
        const RenderSafeSideBar = () => {
            if (this.props.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SafeSideBar device_mode={this.props.device_mode} uid={this.props.uid} SetSearchString={this.props.SetSearchString} Folders={this.props.folders} FetchUserFolders={this.props.FetchUserFolders} selectedFolderID={this.props.selectedFolderID} SetSelectedFolder={this.props.SetSelectedFolder} UpdateFolders={this.props.UpdateFolders} UpdateSafe={this.props.UpdateSafe} UpdateSingleFolder={this.props.UpdateSingleFolder} ShowFavorites={this.props.ShowFavorites} UpdateSafeItem={this.props.UpdateSafeItem} attemptRefresh={this.props.attemptRefresh} />;
        }

        return (
            <div className="div_dashboard">
                {RenderSafeSideBar()}
                <Safe uid={this.props.uid} device_mode={this.props.device_mode} safe={this.props.safe} FetchSafe={this.props.FetchSafe} searchString={this.props.searchString} SetSearchString={this.props.SetSearchString} selectedFolderID={this.props.selectedFolderID} showFavorites={this.props.showFavorites} attemptRefresh={this.props.attemptRefresh}/>
            </div>
        );
    }
}