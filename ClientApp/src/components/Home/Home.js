import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { ReactTitle } from 'react-meta-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { Link, NavLink } from 'react-router-dom';
import { CookiesPolicy } from '../CookiesPolicy/CookiesPolicy';

export class Home extends Component {
    static displayName = Home.name;

    render() {
      return (
          <div className="wrapper">
              <MetaTags>
                  <meta charset="utf-8" />
                  <meta name="description" content="" />
                  <meta name="keywords" content="HTML, CSS, JavaScript, React" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              </MetaTags>
              <ReactTitle title="Home" />
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