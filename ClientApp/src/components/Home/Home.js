import React, { Component } from 'react';
import Starter from './Starter/Starter';
import About from './About/About';
import Information from './Information/Information'
import Morals from './Morals/Morals'

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
          <>
              <Starter/>
              <About id = "about"/>
              <Information/>
              <Morals/>
             
           </>
      );
  }
}