'use strict';
/* eslint no-console: 0 */

import React, { Component } from 'react';
import {Image, Platform} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';
import {mapboxpk} from './mapboxkey';

import {Button, Icon} from 'native-base';

console.log(mapboxpk);
const accessToken = mapboxpk;
Mapbox.setAccessToken(accessToken);

export class MapExample extends Component {

  state = {
    center: {
      latitude: 34.0221900940,
      longitude: -118.2845382690
    },
    zoom: 15,
    annotations:[],
    userTrackingMode: Mapbox.userTrackingMode.none

  };
  annImages={
    self: {source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
           height: 25,
           width: 25},  
    dest: {source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
           height: 25,
           width: 25}  
  };

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
    console.log('onChangeUserTrackingMode', userTrackingMode);
  };

  componentWillMount() {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress);
    });
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles);
    });
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error);
    });
  }

  componentWillUnmount() {
    this._offlineProgressSubscription.remove();
    this._offlineMaxTilesSubscription.remove();
    this._offlineErrorSubscription.remove();
  }

  buildAnnotation(id, coordinates, titles, subtitle, annotationImage){
    return {
      id:id,
      coordinates: coordinates,
      type: 'point',
      title: titles,
      subtitle: subtitle,
      annotationImage: annotationImage
    };
  }

  setAnnotation(newAnnotation){
     this.removeAnnotation(newAnnotation.id);
     this.setState({annotations: [ ...this.state.annotations,newAnnotation]});
  }

  removeAnnotation(id){
      this.state.annotations.filter(a => a.id !== id);
  }
  setCenterWithAnn(latitude, longitude, id){
    var an = this.buildAnnotation(id, [latitude, longitude], 
                                   data.fullName, data.shortName, this.annImages[id]);
                this.setAnnotation(an);
    this._map.selectAnnotation(id);
    this.setCenter(latitude,longitude);
  }
  setCenter(latitude, longitude){
    this._map&&this._map.setCenterCoordinateZoomLevel(latitude, longitude, 18);
  }

  getSelfLocation(callback){
    navigator.geolocation.getCurrentPosition((position) =>{
          console.log(position);
          console.log('l:'+position.latitude+'r:'+position.longitude);
          callback&&callback(position.latitude, position.longitude, 'self');
          },
          (error) => alert(JSON.stringify(error)),
          {enableHighAccuracy: false, timeout: 5000, maximumAge: 6000});
  }

  nextState(eventKey, dataKeys){
    switch(eventKey){
      case 'selectLocation':
                data = this.props.store.getData(dataKeys);
                console.log(data);
                var latitude = parseFloat(data.latitude);
                var longitude = parseFloat(data.longitude);
                this.annImages['dest'].fullName=data.fullName;
                this.annImages['dest'].shortName=data.shortName;
                this.setCenterWithAnn(latitude, longitude, 'dest');
                break;
      default: return eventKey;
    }
  }
  render() {
    StatusBar.setHidden(true);
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          showsUserLocation={true}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          styleURL={Mapbox.mapStyles.light}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />
        <View>
        <Button large transparent style={{position: 'absolute', bottom:50, right:30, width:80, height:80}}
        onPress={()=>{   //console.log('pressed');
                          this.getSelfLocation(setCenterWithAnn);
                      }
                }>
                <Icon name='md-person'/>
        </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //,
    //alignItems: 'stretch'
  },
  map: {
    flex: 1,
    //height: 500,
    //alignSelf : 'stretch'
    //margin : 0
  },
  scrollView: {
    //flex: 1
  }
});