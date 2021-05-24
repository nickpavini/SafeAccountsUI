import React, { Component } from 'react';
import './SafeItemContextMenu.css';
import { Redirect } from 'react-router-dom';

export class SafeItemContextMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false, toUrl: null
        }

        // function bindings
        this.handleClick = this.handleClick.bind(this);
        this.AddItem = this.AddItem.bind(this);
        this.EditSafeItem = this.EditSafeItem.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }

    // unrender if we click away
    async handleClick(e) {
        this.props.CloseContextMenu();
    }

    render() {
        // redirect if needed
        if (this.state.redirect)
            return <Redirect to={this.state.toUrl} />

        // menu options
        return (
            <div id="menu_safeitem" style={{ top: this.props.top, left: this.props.left }}>
                <span className="menu_safeitem" id="menu_safeitem_add_item" onClick={this.AddItem}>Add Item</span><br />
                <span className="menu_safeitem" id="menu_safeitem_edit_item" onClick={this.EditSafeItem}>Edit Item</span><br />
            </div>
        );
    }

    // redirect to page for adding an item to the safe
    AddItem() {
        this.setState({ redirect: true, toUrl: '/addsafeitem' })
    }

    // set redirect and go to safeitems path and render in edit mode
    EditSafeItem() {
        this.setState({ redirect: true, toUrl: "/safeitems/" + this.props.item.id.toString() });
    }
}
