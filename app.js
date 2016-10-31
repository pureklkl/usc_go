
import React, { Component } from 'react';
import { Text, View, AppRegistry, StyleSheet, Modal, Image, Platform, PermissionsAndroid } from 'react-native';

import {FloatSearchResult} from './AutoSearchResult';
import {Dispatcher} from './minFlux/Dispatcher'
import {LocatorSuggestion} from './uscapi/LocatorSuggestion';
import {MapExample} from './exampleMap';
import {SearchInput} from './SearchInput';

import {_Debug} from './debugHelper/wraper';

_Debug.mode = false ;

class USCGOmain extends Component {

	constructor() {
		super();
		this.dispather = new Dispatcher();
		this.locatorSuggestion = new LocatorSuggestion();
	}

	componentDidMount() {
		this.dispather.viewRegist('suggestionReady', this._searchBar);
		this.dispather.viewRegist('waitSuggestion', this._searchResult);
		this.dispather.viewRegist('queryChange', this._searchResult);
		this.dispather.viewRegist('queryClear',  this._searchBar);
		this.dispather.viewRegist('selectLocation',  this._mapView);
		this.dispather.viewRegist('permissionChange', this._mapView);

		this.locatorSuggestion.init(this.dispather);
		this._searchBar.locatorSuggestion=this.locatorSuggestion;
		this.getPermission();
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

			<View style={{position: 'absolute', top: 35, left:0, right:0}}>

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

	permissionHelper(permission){
		PermissionsAndroid.checkPermission(permission).then(
			(get)=>{
				try{
					if(!get){
						PermissionsAndroid.requestPermission(permission)
						.then((granted)=>{
							this.dispather.dataStore(permission, granted);
							this.dispather.triger('permissionChange', permission);
						}
						);   
					}
					else{
						this.dispather.dataStore(permission,true);
						this.dispather.triger('permissionChange', permission);
					}
				}
				catch(error){
					_Debug.console.log(error);
				}
			},
			(error)=>{_Debug.console.log(error)}
			)
	}

	getPermission(){
      //after marshmallow we need request permission on runtime.
      if(Platform.OS == 'android'&&Platform.Version>=23){
      	this.permissionHelper(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        //this.permissionHelper(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
}
}


AppRegistry.registerComponent('USCGO', () => USCGOmain);