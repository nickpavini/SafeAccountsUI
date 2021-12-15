import React, { Component } from 'react';
import { AttempRefresh } from '../HelperFunctions.js'
import './Account.css';

export class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountOptions: { "UserSettings": ["My Account"] }, // this will hold all of the different options per category
            selectedOption: "My Account" // start with My Account area
        };

        //function bindings
        /*
         *  I have no idea why everything is working without bindings but ill leave it for now 
         *  in order to experiment a bit
         */ 
    }

    render() {
        var contents = null;

        if (this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE"))
            contents = this.AccountPageDesktop();
        else
            contents = this.AccountPageMobile();

        return contents;
    }

    AccountPageDesktop() {
        return (
            <div id="account_page_container">
                <div id="acc_page_left">
                    <div id="acc_page_options">
                        {
                            // go through each category of account options
                            Object.keys(this.state.accountOptions).map((key, index) => {
                                return (
                                    <div key={index}>
                                        <p id="acc_page_options_category">{key}</p>
                                        {
                                            // loop through all the options in this category
                                            this.state.accountOptions[key].map((value, index) => {
                                                if (value === this.state.selectedOption)
                                                    return <div key={index} className="acc_options" style={{ "backgroundColor": "rgba(120, 120, 120)", "borderRadius": "3px", "color": "white"}} onClick={() => this.setState({ selectedOption: value })} >{value}</div> // set the selected option on click
                                                else
                                                    return <div key={index} className="acc_options" onClick={() => this.setState({ selectedOption: value })} >{value}</div> // set the selected option on click
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                <div id="acc_page_right">
                    <div id="acc_page_settings">
                        {this.RenderAccPageSettings()}
                    </div>
                </div>
            </div>
        );
    }

    RenderAccPageSettings() {
        if (this.state.selectedOption === "My Account")
            return this.RenderMyAccountInfo();
        /*
         * Here we would do a bunch of if else statements to choose what to render on the right hand side
         */ 
    }

    RenderMyAccountInfo() {
        return (
            <div>
                <p id="my_account_header">My Account</p>
                <div id="div_acc_info_container">
                    <span className="acc_info_label">First Name</span>
                    <div><span className="acc_info" id="acc_info_firstName" onBlur={() => this.BlurInfo("acc_info_firstName")}>{this.props.AppState.account_info.first_Name}</span><button className="btn_acc_info_edit" onClick={() => this.SetInfoEditable("acc_info_firstName")} /></div>
                    <span className="acc_info_label">Last Name</span>
                    <div><span className="acc_info" id="acc_info_lastName" onBlur={() => this.BlurInfo("acc_info_lastName")}>{this.props.AppState.account_info.last_Name}</span><button className="btn_acc_info_edit" onClick={() => this.SetInfoEditable("acc_info_lastName")} /></div>
                    <span className="acc_info_label">Email</span>
                    <div><span className="acc_info" id="acc_info_email" onBlur={() => this.BlurInfo("acc_info_email")}>{this.props.AppState.account_info.email}</span><button className="btn_acc_info_edit" onClick={() => this.SetInfoEditable("acc_info_email")} /></div>
                </div>
            </div>
        );
    }

    SetInfoEditable(id) {
        document.getElementById(id).setAttribute("contentEditable", "true");
        document.getElementById(id).focus();
        document.getElementById(id).addEventListener("keypress", function (e) {
            if (e.keyCode === 13) {
                this.blur();
            }
        });
    }

    BlurInfo(id) {
        // if the element wasnt being edited then we just return
        if (document.getElementById(id).attributes.getNamedItem("contentEditable") === "false")
            return;

        // set it no longer editable, remove the event listener for enter key, and get the current folder name
        document.getElementById(id).setAttribute("contentEditable", "false");
        var info = document.getElementById(id).innerHTML;

        // check for name change, and set as needed
        if (info !== this.props.AppState.account_info.first_Name) {
            this.EditInfo(id, id.replace("acc_info_", ""), info);
        }
    }

    async EditInfo(id, infoToEdit, info) {

        // set url based on info to edit
        var url = process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid;
        var updatedAccInfo = this.props.AppState.account_info
        var resetInfo = ''
        switch(infoToEdit) {
            case "firstName":
                url += '/firstname';
                updatedAccInfo.first_Name = info;
                resetInfo = this.props.AppState.account_info.first_Name
                break;
            case "lastName":
                url += '/lastname';
                updatedAccInfo.last_Name = info;
                resetInfo = this.props.AppState.account_info.last_Name
                break;
            case "email":
                url += '/email';
                resetInfo = this.props.AppState.account_info.email
                break;
            default:
                return;
        }

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': process.env.REACT_APP_API_KEY,
                'AccessToken': window.localStorage.getItem("AccessToken")
            },
            body: "\"" + info + "\""
        };

        //make request and get response
        const response = await fetch(url, requestOptions);
        if (response.ok) {
            this.props.SetAppState({account_info: updatedAccInfo})
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid !== null)
                this.EditInfo(infoToEdit, info); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            document.getElementById(id).innerHTML = resetInfo; // reset info if the api call failed
        }

    }

    AccountPageMobile() {
        return (
            <div id="account_page_container">
                <div id="acc_page_mobile">
                    {this.RenderAccPageSettings()}
                </div>
            </div>
        );
    }
}
