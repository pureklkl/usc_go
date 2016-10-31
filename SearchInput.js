import React, { Component } from 'react';
import {Platform, Text, View } from 'react-native';
import NativeBaseComponent from './node_modules/native-base/Components/Base/NativeBaseComponent';
import {Button, Icon, InputGroup, Input,} from 'native-base';
import computeProps from './node_modules/native-base/Utils/computeProps';
import {_Debug} from './debugHelper/wraper';

export class SearchInput extends NativeBaseComponent {

	constructor(){
		super();
	}

	propTypes: {
        style : React.PropTypes.object
    };

	getInitialStyle() {
		return {
			default: {
				backgroundColor: 'white',
				margin: 20
			},
			inputDefault: {
				height: 60, 
				fontSize: 24
			},
			buttonDefault: {
				width:40,
        paddingBottom:15
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
        if(eventKey=='queryClear'){
        	_Debug.console.log('clicked'); 
        	this._searchBar._textInput.setNativeProps({text: ''});
        	this.queryChange('');
        	this._searchBar.setState({});
        }
        else if(eventKey=='suggestionReady'){
          	var query = this.props.store.getData('query');
          	if(query)
            	this.queryChange(query);
        }
  	};

	render(){
		return (
        <InputGroup borderType='rounded' {...this.prepareRootProps()}>
              <Icon style={{marginLeft:10}} name='ios-search'/>
              
              <Input 
                placeholder='Search' style={this.getInitialStyle().inputDefault} 
                ref={(searchBar)=>{this._searchBar=searchBar;}} 
                onChangeText={text=>this.queryChange(text)}/>

              <Button large transparent  style={this.getInitialStyle().buttonDefault} 
              onPress={()=>this.clearQuery()}><Icon name='ios-close'/></Button>
        </InputGroup>
			);
	}

    queryChange(text){
        var query=text.trim();
        if(query.length>0){
          if(!this.locatorSuggestion.isIndexReady()){
            this.props.store.dataStore('query', query);
            this.props.store.triger('waitSuggestion',[]);
            return;
          }
          var suggestionShow=[];
          var suggestions=this.locatorSuggestion.getSuggestion(query);
          suggestions.forEach((s)=>{
            suggestionShow.push({fullName:s.data.name,
                                 shortName:s.data.code,
                                 latitude:s.data.latitude,
                                 longitude:s.data.longitude});
          });
          this.props.store.dataStore('querySuggestion', suggestionShow);
        }
        else{
          _Debug.console.log('clear');
          this.props.store.dataStore('querySuggestion', []);
        }
        this.props.store.triger('queryChange', 'querySuggestion');
    }

    clearQuery(){
        this.props.store.triger('queryClear','');
    }
}