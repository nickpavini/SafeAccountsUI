import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { NavLink } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

    render() {
      return (
          <div className="wrapper">
              <p className="slogan">Never worry about passwords, we got you covered</p>
              <img src={require("./Assets/securityIcon.png")} alt="SecurityIcon" className="security-icon" />
              <p className="be-safe">Be Safe with</p>
              <img src="" alt="Logo" className="logo" />
              <NavLink to="/signup" className="signup-button-container">
                      Start for free
              </NavLink>
          </div>
      );
  }
}