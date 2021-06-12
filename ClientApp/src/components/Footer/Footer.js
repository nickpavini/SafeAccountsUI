import React, { Component } from 'react';
import './Footer.css';

export class Footer extends Component {
    render() {
        return <div className="div_footer" style={{ height: this.props.height }} >Inside Footer Component</div>
    }
}
