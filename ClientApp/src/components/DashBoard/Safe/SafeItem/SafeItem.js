﻿import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SafeItem.css';

export class SafeItem extends Component {
    static displayName = SafeItem.name;

    constructor(props) {
        super(props);

        this.state = {
            redirect: false, toUrl: null
        }

        // function bindings
        this.SetItemSelected = this.SetItemSelected.bind(this);
        this.ViewSafeItem = this.ViewSafeItem.bind(this);
    }

    componentDidMount() {
        document.getElementById("div_safeitem_" + this.props.info.id.toString()).addEventListener('contextmenu', e => {
            e.preventDefault();
            this.props.OpenContextMenu(this.props.info.id, e.pageX + "px", e.pageY + "px");
        });
    }

    render() {
        // redirect to edit mode upon clicking
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />;

        var input_id = "input_chk_safeitem_" + this.props.info.id.toString();
        var div_id = "div_safeitem_" + this.props.info.id.toString();
        return (
            <div id={div_id} className="div_safeitem" onClick={this.ViewSafeItem}>
                <input type="checkbox" defaultChecked={false} onClick={this.SetItemSelected} id={input_id} className="input_chk_safeitem" ></input>
                <span id="span_safeitem_title" onClick={this.ViewSafeItem}>{this.props.info.title}</span><br />
            </div>
        );
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
}