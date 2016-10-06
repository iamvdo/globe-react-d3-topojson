import React from 'react';

export default class Globe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0
    };
    this.data = this.props.data;
  }

  componentWillMount() {
    if (this.props.position) {
      this.setState({lat: this.props.position.lat, lng: this.props.position.lng});
    }
  }

  componentDidMount(){
    this._createD3Globe();
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateD3Globe(prevState);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.position) {
      this.setState({lat: newProps.position.lat, lng: newProps.position.lng});
    }
  }

  render() {
    return (
      <div id="globe" ref="globe">
        <p>Lat: {this.state.lat}, Lng: {this.state.lng}</p>
      </div>
    );
  }

  _createD3Globe() {
    const size = 100;
    const projection = d3.geoOrthographic().scale(size / 2).translate([size / 2, size / 2]).clipAngle(90).rotate([-this.state.lng, -this.state.lat]);
    const data = topojson.feature(this.data, this.data.objects.land);
    const svg = d3.select(this.refs.globe).append("svg");
          svg.attr("width", size).attr("height", size);
    const path = d3.geoPath().projection(projection);
    const world = svg.append("path").datum(data).attr("d", path);
    const paths = svg.selectAll("path");

    this.projection = projection;
    this.path = path;
    this.paths = paths;
  }


  _updateD3Globe(prevState) {
    const oldPosition = [Number(prevState.lng), Number(prevState.lat)];
    const currentPosition = [Number(this.state.lng), Number(this.state.lat)];
    const from = oldPosition;
    const to = currentPosition;
    const diff = from[0] - to[0];
    if (diff > 180) { from[0] -= 360 } else if (diff < -180) { from[0] += 360 }
    const distance = this._distance(from[1], from[0], to[1], to[0]);
    const update = t => {
      var lat1 = from[1],
          lng1 = from[0],
          lat2 = to[1],
          lng2 = to[0],
          lat = lat1 + (lat2 - lat1) * t,
          lng = lng1 + (lng2 - lng1) * t;
      this._rotate(lat, lng)
    }
    d3.transition()
      .duration(Math.max(distance * 1500, 500))
      .tween("rotation", () => update);
  }

  _rotate(lat, lng) { 
    this.projection.rotate([-lng, -lat]);
    this.paths.attr("d", this.path)
  }

  _toRad(degree) {
    return degree * Math.PI / 180
  }

  _distance(lat1, lon1, lat2, lon2) {
    var dLat = this._toRad(lat2 - lat1),
        dLon = this._toRad(lon2 - lon1),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

}
