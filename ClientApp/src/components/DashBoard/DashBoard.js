import React, { Component } from 'react';
import './DashBoard.css';
import { Safe } from './Safe/Safe';
import { SafeSideBar } from '../SafeSideBar/SafeSideBar';

export class DashBoard extends Component {
    render() {
        const RenderSafeSideBar = () => {
            if (this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE"))
                return <SafeSideBar
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                />;
        }

        return (
            <div className="div_dashboard">
                {RenderSafeSideBar()}
                <Safe
                    AppState={this.props.AppState}
                    SetAppState={this.props.SetAppState}
                />
            </div>
        );
    }
}