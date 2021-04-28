import React, { Component } from 'react';
import './SafeItem.css';

export class SafeItem extends Component {
    static displayName = SafeItem.name;

    constructor(props) {
        super(props);

        this.SetItemSelected = this.SetItemSelected.bind(this);
    }

    componentDidMount() {
    }

    render() {
        var id = "input_chk_safeitem_" + this.props.info.ID;
        return (
            <div class="div_safeitem">
                <div class="input_chk_safeitem">
                    <input type="checkbox" defaultChecked={false} onClick={this.SetItemSelected} id={id}></input>
                </div>

                <div class="div_safeitem_info">
                    <a class="safeitem_info" id="a_safeitem_title" href="javascript:;" onClick="">{this.props.info.Title}</a><br />
                    <p class="safeitem_info" id="p_safeitem_login">{this.props.info.Login}</p>
                </div>
            </div>
        );
    }

    async SetItemSelected(event) {
        this.props.UpdateSelectedItems(event.target.id.replace("input_chk_safeitem_", ""))
    }
}
