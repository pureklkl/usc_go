'use strict';
/* eslint no-console: 0 */

import React, { Component } from 'react';
import {Image, Platform} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';

import {mapboxpk} from './mapboxkey';
import polyline from 'polyline'

import {Button, Icon} from 'native-base';
import computeProps from './node_modules/native-base/Utils/computeProps';

console.log(mapboxpk);
const accessToken = mapboxpk;
Mapbox.setAccessToken(accessToken);

export class MapExample extends Component {

  thhCenter = {
      latitude: 34.0221900940,
      longitude: -118.2845382690
  };

  state = {
    center: this.thhCenter,
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

  propTypes: {
      style : React.PropTypes.object
  };

  getInitialStyle() {
    return {
      default: {
        flex: 1
      },
      map:{
        flex:1
      },
      button:{
        position: 'absolute', 
        bottom:50, 
        right:30, 
        width:80, 
        height:80
      }
    }
  }

  prepareRootProps(){
    var defaultProps = {
            style: this.getInitialStyle().default
        };
    return computeProps(this.props, defaultProps);
  }
  
  nextState(eventKey, dataKeys){
    switch(eventKey){
      case 'selectLocation':
                var data = this.props.store.getData(dataKeys);
                console.log(data);
                var latitude = parseFloat(data.latitude);
                var longitude = parseFloat(data.longitude);
                this.annImages['dest'].fullName=data.fullName;
                this.annImages['dest'].shortName=data.shortName;
                this.getSelfLocation(this.self2dest, {longitude:longitude, latitude:latitude});
                //this.direct(this.thhCenter, {longitude:longitude, latitude:latitude});
                this.setCenterWithAnn(latitude, longitude, 'dest');
                break;
      default: return eventKey;
    }
  }

  onRegionDidChange=(location)=>{
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };

  getMapOptions(){
      return {
        initialCenterCoordinate: this.state.center,
        initialZoomLevel: this.state.zoom,
        initialDirection: 0,
        showsUserLocation: true,
        rotateEnabled: true,
        scrollEnabled: true,
        zoomEnabled: true,
        styleURL: Mapbox.mapStyles.light,
        userTrackingMode: this.state.userTrackingMode,
        annotations: this.state.annotations,
        onRegionDidChange: this.onRegionDidChange
      };
  }

  mapboxAPI={
    addr:'https://api.mapbox.com/directions/v5/',
    profile:{
              dirve: 'mapbox/driving/',
              walk:  'mapbox/walking/'
            },
    token:accessToken,
  };

  buildQuery(src, dest){
    var query = encodeURI(this.mapboxAPI.addr+this.mapboxAPI.profile.walk)
                +encodeURIComponent(src.longitude+','+src.latitude+';'
                                   +dest.longitude+','+dest.latitude+'.json')
                +'?'+'access_token='+this.mapboxAPI.token;
    console.log(JSON.stringify(src)+JSON.stringify(dest));
    return query;
  }
  
  direct(src, dest){
    var query = this.buildQuery(src, dest);
    fetch(query).
    then((response) => {
      console.log(response.status); 
      if(response.status==200)
        return response.text();
      else
        alert('Route failed, please check net connection.');
      },
      (reason)=>console.log(reason)).
      then((responseText) => {
        var route=JSON.parse(responseText);
        console.log(JSON.stringify(route));
        console.log(JSON.stringify(route.routes[0].geometry));
        var objRoute=polyline.decode(route.routes[0].geometry);
        console.log(JSON.stringify(objRoute));
        this.setAnnotation({
          coordinates: objRoute,
          type: 'polyline',
          id: 'route',
          strokeColor:'#FFCC00'
        })
      })
  }

  self2dest(selfLa, selfLong, label, destCoordWrap){
    var destCoord = destCoordWrap[0];
    if(destCoord){
      this.direct({latitude:selfLa, longitude:selfLong}, destCoord);
    }
  }

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
    var title, subtitle;
    if(id=='self'){
      title = 'You';
      subtitle='';
    }
    else{
      title = this.annImages[id].fullName;
      subtitle = this.annImages[id].shortName;
    }
    var an = this.buildAnnotation(id, [latitude, longitude], 
                                  title,subtitle, this.annImages[id]);
    this.setAnnotation(an);
    this._map.selectAnnotation(id);
    this.setCenter(latitude,longitude);
  }

  setCenter(latitude, longitude){
    this._map&&this._map.setCenterCoordinateZoomLevel(latitude, longitude, 18);
  }

  getSelfLocation(callback, ...args){
    navigator.geolocation.getCurrentPosition((position) =>{
          console.log(position);
          console.log('l:'+position.latitude+'r:'+position.longitude);
          callback&&callback.call(this, position.coords.latitude, position.coords.longitude, 'self'
            , args);
          },
          (error) => alert('Locate failed\n'+JSON.stringify(error)),
          {enableHighAccuracy: true, timeout: 5000, maximumAge: 6000});
  }



  render() {
    StatusBar.setHidden(true);
    return (
      <View {...this.prepareRootProps()}>
          <MapView
            ref={map => { this._map = map; }}
            style={this.getInitialStyle().map}
            {...this.getMapOptions()}
            annotationsAreImmutable/>
        <View>
          <Button large transparent style={this.getInitialStyle().button}
          onPress={()=>{this.getSelfLocation(this.setCenter);}}>
                  <Icon name='md-person'/>
          </Button>
        </View>
      </View>
    );
  }
};
