import React from 'react';
import { requireNativeComponent } from 'react-native';

class MapView extends React.Component {
  render() {
    return <RNTMap {...this.props}/>;
  }
}

var RNTMap = requireNativeComponent('RNTMap', MapView);

module.exports = MapView;