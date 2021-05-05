import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <body>
          <p>Never worry about passwords, we got you covered</p>
          <img src="Assets/securityIcon.png" alt="SecurityIcon"></img>
          <p>Be Safe with</p>
          <img src="" alt="Logo">Logo to be added</img>
          <span class="sinup-button">
            <button type="button">Start for free</button>
          </span>
          <div class="cookies-window">
            <pre>[cookies policy go here]</pre>
            <span>
              <button type="button"><img src="Assets/closeIcon.png" alt="close-icon"></img></button>
            </span> 
          </div>
        </body>
      </div>
    );
  }
}
