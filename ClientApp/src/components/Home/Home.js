import React, { Component } from 'react';
import './Home.css';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../../Assets/logo.svg';

export class Home extends Component {
    static displayName = Home.name;

    render() {
      return (
          <div className="div_home">
              <p className="slogan">Never worry about passwords, we got you covered.</p>
              <LogoSvg id="svg_home_logo" fill="#000"/>
              <p className="be-safe">Be proactive with Safe Accounts</p>
              <NavLink to="/signup" className="signup-button-container">Sign Up!</NavLink>
          </div>
      );
  }
}