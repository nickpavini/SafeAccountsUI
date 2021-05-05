import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { ReactTitle } from 'react-meta-tags';

export class Home extends Component {
  static displayName = Home.name;
  {/* This function removes the element that's passed to it*/}
  remove (el) {
    var element = el;
    element.remove();
  }

  render () {
      return (
      <div className="wrapper">
        <MetaTags>
            <meta charset="utf-8" />
            {/* Only for debugging the time for refresh will be either changed or removed later*/}
            <meta http-equiv="refresh" content="1" />
            <meta name="description" content="" />
            <meta name="keywords" content="HTML, CSS, JavaScript, React" />
            {/* Prevents the storage of data in a cache */}
            <meta http-equiv="cache-control" content="no-cache" /> 
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </MetaTags>
        <ReactTitle title="Home" />
        <body>
          <p>Never worry about passwords, we got you covered</p>
          <img src={require("./Assets/securityIcon.png")} alt="SecurityIcon" />
          <p>Be Safe with</p>
          <img src="" alt="Logo" />
          <span class="sinup-button">
            <button type="button">Start for free</button>
          </span>
          <div class="cookies-window">
            <pre>[cookies policy go here]</pre>
            <span>
                {/* A button that on click removes the cookies-window by calling on the remove fuction*/}
                <button type="button" onClick="remove(.cookies-window)"><img src={require("./Assets/closeIcon.png")} alt="close-icon"></img></button>
            </span> 
          </div>
        </body>
      </div>
    );
  }
}