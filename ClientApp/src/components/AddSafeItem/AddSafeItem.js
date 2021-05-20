import React, { Component } from 'react';
import './AddSafeItem.css';

export class AddSafeItem extends Component {

    constructor(props) {
        super(props);
        this.state = { rememberMe: false };

        // function bindings
        this.AddSafeItem = this.AddSafeItem.bind(this);
    }

    render() {
        return (
            <div class="div_add_safe_item">
                <form id="form_add_safe_item" onSubmit={this.AddSafeItem}>
                    <div class="container">
                        <label id="lbl_safe_item_title" htmlFor="text_input_safe_item_title"><b>Title</b></label><br />
                        <textarea class="text_input_safe_item" placeholder="" id="text_input_safe_item_title" rows="1" cols="38" required></textarea>
                        <br />
                        <label id="lbl_safe_item_login" htmlFor="text_input_safe_item_login"><b>Login</b></label><br />
                        <textarea class="text_input_safe_item" placeholder="" id="text_input_safe_item_login" rows="1" cols="38" required></textarea>
                        <br />
                        <label id="lbl_safe_item_password" htmlFor="text_input_safe_item_password"><b>Password</b></label><br />
                        <textarea class="text_input_safe_item" placeholder="" id="text_input_safe_item_password" rows="1" cols="38" required></textarea>
                        <br />
                        <label id="lbl_safe_item_description" htmlFor="text_input_safe_item_description"><b>Description</b></label><br />
                        <textarea class="text_input_safe_item" placeholder="" id="text_input_safe_item_description" rows="4" cols="38" required></textarea>
                        <br />
                        <button id="btn_add_safe_item" type="submit"><b>Store in Safe</b></button>
                    </div>
                </form>
            </div>
        );
    }

    AddSafeItem(event) {
        event.preventDefault(); //prevent page refresh
    }
}
