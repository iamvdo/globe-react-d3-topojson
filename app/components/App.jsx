import React from 'react';

import Globe from './Globe';
import globedata from '../data/globedata';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      position: {lat: 48.85, lng: 2.35}
    }
  }

  render() {
    return (
      <div id="content">
        <h1>Globe <small>(React + d3)</small></h1>
        <p>Extracted from <a href="https://earthview.withgoogle.com/">https://earthview.withgoogle.com/</a></p>
        <Globe data={globedata} position={this.state.position} />
        <button onClick={(e) => this._onSwitch(e)}>Random Lat/Lng</button>
      </div>
    );
  }

  _onSwitch() {
    const newLat = parseFloat((Math.random() * 180) - 90).toFixed(2);
    const newLng = parseFloat((Math.random() * 360) - 180).toFixed(2);
    this.setState({position: {lat: newLat, lng: newLng}});
  }
}
