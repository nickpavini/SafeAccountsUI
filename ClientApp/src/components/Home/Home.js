import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { ReactTitle } from 'react-meta-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

export class Home extends Component {
  static displayName = Home.name;

  closeCookies(){
      document.getElementById("cookies-window").style.display = 'none';
  }

  render () {
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
              <a href={require("../SignUp/SignUp.js")} className="signup-button-container">
                  <span className="signup-button">
                      Start for free
                  </span>
              </a>
              <div className="cookies-window" id="cookies-window">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16" onClick={this.closeCookies}>
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                  </svg>
                  <pre className="cookies">[cookies policy go here]</pre>
              </div>
          </div>
      );
  }
}