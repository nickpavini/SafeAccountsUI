import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SafeItem.css';

export class SafeItem extends Component {
    static displayName = SafeItem.name;

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            toUrl: null
        }

        // function bindings
        this.SetItemSelected = this.SetItemSelected.bind(this);
        this.ViewSafeItem = this.ViewSafeItem.bind(this);
        this.SaveItemEdit = this.SaveItemEdit.bind(this);
    }

    render() {
        // when ready to switch paths
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />

        // if on dashboar, we are rendering a snippet until people open the account or right click to get password
        if (window.location.pathname === "/dashboard") {
            var id = "input_chk_safeitem_" + this.props.info.id.toString();
            return (
                <div class="div_safeitem" onClick={this.ViewSafeItem}>
                    <input type="checkbox" defaultChecked={false} onClick={this.SetItemSelected} id={id} class="input_chk_safeitem" ></input>
                    <span id="span_safeitem_title" onClick={this.ViewSafeItem}>{this.props.info.title}</span><br />
                </div>
            );
        }
        else { // in this case we are viewing a single account as a whole page in edit mode
            return (
                <div class="div_edit_safe_item">
                    <form id="form_edit_safe_item" onSubmit={this.SaveItemEdit}>
                        <div class="container">
                            <label id="lbl_edit_item_title" htmlFor="text_input_edit_item_title"><b>Title</b></label><br />
                            <textarea class="text_input_edit_item" placeholder="" id="text_input_edit_item_title" rows="1" cols="38" defaultValue={this.props.info.title} required></textarea>
                            <br />
                            <label id="lbl_edit_item_login" htmlFor="text_input_edit_item_login"><b>Login</b></label><br />
                            <textarea class="text_input_edit_item" placeholder="" id="text_input_edit_item_login" rows="1" cols="38" defaultValue={this.props.info.login} required></textarea>
                            <br />
                            <label id="lbl_edit_item_password" htmlFor="text_input_edit_item_password"><b>Password</b></label><br />
                            <textarea class="text_input_edit_item" placeholder="" id="text_input_edit_item_password" rows="1" cols="38" defaultValue={this.props.info.password} required></textarea>
                            <br />
                            <label id="lbl_edit_item_description" htmlFor="text_input_edit_item_description"><b>Description</b></label><br />
                            <textarea class="text_input_edit_item" placeholder="" id="text_input_edit_item_description" rows="4" cols="38" defaultValue={this.props.info.description} required></textarea>
                            <br />
                            <button id="btn_save_edit" type="submit"><b>Save</b></button>
                        </div>
                    </form>
                </div>
            );
        }
    }

    async SetItemSelected(event) {
        this.props.UpdateSelectedItems(event.target.id.replace("input_chk_safeitem_", ""))
    }

    // set redirect and go to safeitems path and render in edit mode
    ViewSafeItem(event) {
        // if this event got fired as a result of the input being checked, we do nothing
        if (event.target.id.includes("input_chk"))
            return;

        this.setState({ redirect: true, toUrl: "/safeitems/" + this.props.info.id.toString() });
    }

    async SaveItemEdit(event) {
        event.preventDefault(); //prevent page refresh
    }
}