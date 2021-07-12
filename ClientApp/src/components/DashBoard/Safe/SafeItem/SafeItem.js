import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SafeItem.css';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AttempRefresh } from '../../../HelperFunctions.js'

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
        this.SetItemIsFavorite = this.SetItemIsFavorite.bind(this);
        this.Drag = this.Drag.bind(this);
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
        var icon_id = "icon_safeitem_star_" + this.props.info.id.toString();
        var icon_color = this.props.info.isFavorite ? "yellow" : "white";
        return (
            <tr id={tr_id} draggable="true" onDragStart={this.Drag} className="tr_safeitem" onClick={this.ViewSafeItem}>
                <td><input type="checkbox" checked={this.props.checked} onChange={this.SetItemSelected} id={input_id} className="input_chk_safeitem" ></input></td>
                <td><FontAwesomeIcon className="icon_safeitem_star" id={icon_id} onClick={this.SetItemIsFavorite} icon={faStar} style={{ color: icon_color }} /></td>
                <td><span id="span_safeitem_title" >{this.props.info.title}</span></td>
                <td><span id="span_safeitem_login" >{this.props.info.login}</span></td>
                <td><span id="span_safeitem_password" >*********</span></td>
                {this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td><span id="span_safeitem_url" >{this.props.info.url}</span></td> : null}
                {this.props.AppState.device_mode === localStorage.getItem("DESKTOP_MODE") ? <td><span id="span_safeitem_last_modified" >{this.props.info.lastModified.split(' ')[0]}</span></td> : null}
            </tr>
        );
    }

    Drag(event) {
        event.dataTransfer.setData("safeitem", JSON.stringify(this.props.info)); // send the entire safeitem
    }

    async SetItemSelected(event) {
        this.props.UpdateSelectedItems(parseInt(event.target.id.replace("input_chk_safeitem_", "")))
    }

    async SetItemIsFavorite(event) {
        document.getElementById(event.currentTarget.id).style.color = this.props.info.isFavorite ? "white" : "yellow"; // set to yellow if not currently favorited, else white because removing the favorite

        // HTTP request options
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'ApiKey': process.env.REACT_APP_API_KEY },
            body: JSON.stringify(!this.props.info.isFavorite), // set as opposite of current
            credentials: 'include'
        };

        //make request and get response
        const response = await fetch(process.env.REACT_APP_WEBSITE_URL + '/users/' + this.props.AppState.uid + '/accounts/' + this.props.info.id.toString() + '/favorite', requestOptions);
        if (response.ok) {
            this.props.info.isFavorite = !this.props.info.isFavorite; // update local value only after successful call
        }
        // unauthorized could need new access token, so we attempt refresh
        else if (response.status === 401 || response.status === 403) {
            var uid = await AttempRefresh(); // try to refresh

            // dont recall if the refresh didnt succeed
            if (uid === null) {
                document.getElementById(event.currentTarget.id).style.color = this.props.info.isFavorite ? "yellow" : "white"; // reset colors if the req failed
                return;
            }

            this.SetItemIsFavorite(); // call again
        }
        // if not ok or unauthorized, then its some form of error. code 500, 400, etc...
        else {
            document.getElementById("icon_safeitem_star").style.color = this.props.info.isFavorite ? "yellow" : "white"; // reset colors if the req failed
        }
    }

    // set redirect and go to safeitems path and render in edit mode
    ViewSafeItem(event) {
        // if this event got fired as a result of the input being checked, we do nothing... there is a hitbox issue with the css star, so this makes us not go to a new page under any condition that clicks the star
        if (event.target.id.includes("input_chk") ||
            event.target.id.includes("icon_safeitem_star") || // this happens if we click the star border
            (
                //this happens if we click directly on the star
                event.target.nearestViewportElement !== undefined &&
                event.target.nearestViewportElement !== null &&
                event.target.nearestViewportElement.id.includes("icon_safeitem_star")
            )
        )
            return;

        this.setState({ redirect: true, toUrl: "/safeitems/" + this.props.info.id.toString() });
    }
}