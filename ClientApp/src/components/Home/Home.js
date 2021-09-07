import React, { Component } from 'react';
import './Home.css';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../../Assets/logo.svg';

export class Home extends Component {
    static displayName = Home.name;

    render() {
      return (
          <div className="div_home">
              <div id="div_home_banner">
                  <LogoSvg id="svg_home_logo" fill="#000" />
                  <div id="div_home_banner_text">
                      <span id="span_slogan" >Never Worry About Passwords!</span>
                      <span id="span_be_safe" >Be Proactive with Safe Accounts.</span>
                      <NavLink to="/signup" className="signup-button-container">Sign Up!</NavLink>
                  </div>
              </div>
              <div id="div_home_container">
                  <div id="div_home_row1">
                      <div id="div_what_is_manager">
                          <img id="img_home_lock" src={require("../../Assets/lock.svg")} alt="" /><br/>
                          <span className="span_home_box_title">What is a password manager?</span>
                          <ul className="ul_home_box_desc">
                              <li>A password manager is a secure program for storing and managing the credentials to your online accounts.</li>
                          </ul>
                      </div>
                      <div id="div_why_use_one">
                          <img id="img_home_safety_net" src={require("../../Assets/safenet.svg")} alt="" /><br />
                          <span className="span_home_box_title">Why should I use one?</span>
                          <ul className="ul_home_box_desc">
                              <li>Using the same password for multiple accounts is dangerous, and memorizing passwords can be troublesome.</li>
                          </ul>
                      </div>
                  </div>
                  <div id="div_home_row2">
                      <div id="div_why_safe_accounts">
                          <span className="span_home_box_title">Why choose Safe Accounts?</span>
                          <ul className="ul_home_box_desc">
                              <li><b>Free and Open Source!</b> Safe Accounts has 0 cost and all of the code is available online for review.</li>
                              <li><b>Simplicity on all platforms!</b> Saving and accessing your passwords on all your devices is safe and easy.</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}