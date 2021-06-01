import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SafeItem.css';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        document.getElementById("tr_safeitem_" + this.props.info.id.toString()).addEventListener('contextmenu', e => {
            e.preventDefault();
            this.props.OpenContextMenu(this.props.info.id, e.pageX + "px", e.pageY + "px");
        });
    }

    render() {
        // redirect to edit mode upon clicking
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />;

        var input_id = "input_chk_safeitem_" + this.props.info.id.toString();
        var tr_id = "tr_safeitem_" + this.props.info.id.toString();
        return (
            <tr id={tr_id} className="tr_safeitem" onClick={this.ViewSafeItem}>
                <td><input type="checkbox" defaultChecked={false} onClick={this.SetItemSelected} id={input_id} className="input_chk_safeitem" ></input></td>
                <td><FontAwesomeIcon id="icon_safeitem_star" icon={faStar} /></td>
                <td><span id="span_safeitem_title" >{this.props.info.title}</span></td>
                <td><span id="span_safeitem_login" >{this.props.info.login}</span></td>
                <td><span id="span_safeitem_password" >*********</span></td>
                <td><span id="span_safeitem_url" >{this.props.info.url}</span></td>
                <td><span id="span_safeitem_last_modified" >{this.props.info.lastModified.split(' ')[0]}</span></td>
            </tr>
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