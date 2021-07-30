import React, { Component } from 'react';
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
                    <div><span className="acc_info">{this.props.AppState.account_info.first_Name}</span><button className="btn_acc_info_edit" onClick={null}/></div>
                    <span className="acc_info_label">Last Name</span>
                    <div><span className="acc_info">{this.props.AppState.account_info.last_Name}</span><button className="btn_acc_info_edit" onClick={null} /></div>
                    <span className="acc_info_label">Email</span>
                    <div><span className="acc_info">{this.props.AppState.account_info.email}</span><button className="btn_acc_info_edit" onClick={null} /></div>
                </div>
            </div>
        );
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
