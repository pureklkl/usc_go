
import React, { Component } from 'react';
import { Text, View, AppRegistry, StyleSheet, Modal, Image, Platform, PermissionsAndroid } from 'react-native';

import {FloatSearchResult} from './AutoSearchResult';
import {Dispatcher} from './minFlux/Dispatcher'
import {LocatorSuggestion} from './uscapi/LocatorSuggestion';
import {MapExample} from './exampleMap';
import {SearchInput} from './SearchInput';


class nativebaseTutorial extends Component {

    constructor(){
      super();
      this.dispather = new Dispatcher();
      this.locatorSuggestion = new LocatorSuggestion();
    }

    componentDidMount(){
      this.dispather.viewRegist('suggestionReady', this._searchBar);
      this.dispather.viewRegist('waitSuggestion', this._searchResult);
      this.dispather.viewRegist('queryChange', this._searchResult);
      this.dispather.viewRegist('queryClear',  this._searchBar);
      this.dispather.viewRegist('selectLocation',  this._mapView);

      this.locatorSuggestion.init(this.dispather);
      this._searchBar.locatorSuggestion=this.locatorSuggestion;

      this.get_permission();
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection:'row', backgroundColor: '#990000'}}>
                  <Text style={{fontSize: 36, flex: 1, textAlign:'center', fontWeight:'bold',color:'white'}}>USC GO</Text>
                </View>

                <View style={{flex: 1}}>   
    
                  <MapExample
                    store={this.dispather} 
                    ref={(mapView)=>{this._mapView=mapView;}}/>
                  
                    <View style={{position: 'absolute', top: 30, left:0, right:0}}>
                    
                      <SearchInput ref={(searchBar)=>{this._searchBar=searchBar;}}
                                   store={this.dispather} />

                      <FloatSearchResult 
                        ref={(searchResult)=>{this._searchResult=searchResult;}} 
                        store={this.dispather}/>

                    </View>
          
                </View>
            </View>
         );
     }

    get_permission(){
      //after marshmallow we need request permission on runtime.
      if(Platform.OS == 'android'&&Platform.Version>=23){
        PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((get)=>{
          //alert(JSON.stringify('fine :'+get));
          if(!get)
            PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        })
        
        PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((get)=>{
          //alert(JSON.stringify('COARSE :'+get));
          if(!get)
            PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        })
      }
    }
 }


AppRegistry.registerComponent('AwesomeProject', () => nativebaseTutorial);