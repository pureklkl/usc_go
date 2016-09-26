 import React, { Component } from 'react';
 import {Platform } from 'react-native';
 import NativeBaseComponent from './node_modules/native-base/Components/Base/NativeBaseComponent';
 import { Spinner, Text, View, Content, 
          Container, Header, Title, 
          Button, Icon, InputGroup, 
          Input, ListItem, List, 
          Radio, CheckBox, Thumbnail, 
          Card, CardItem, H3 } from 'native-base';

export class FloatSearchResult extends NativeBaseComponent {

	constructor(){
		super();
		this.state={show:false};
	}

	nextState(eventKey, dataKeys){
		switch(eventKey){
			case 'queryChange' : 
				data = this.props.store.getData(dataKeys);
					if(Array.isArray(data)&&data.length>0){
						console.log(data);
						this.itemData=data;
						console.log(this.itemData);
						this.setState({show:true});
					}
					else{
						this.setState({show:false});
					}
				break;
		}
	}

	getInitialStyle() {
		return {
			default: {
			},
			itemDefault: {
				marginLeft: 30,
				marginRight: 30,
				borderLeftWidth: 1,
				borderRightWidth: 1,
				borderBottomWidth: 1,
				paddingLeft: 10,
				paddingRight: 10
			}
		}
	}

	renderChildren(){
		var itemView = [];
		var itemData = this.itemData;
        console.log(itemData);
		if(!Array.isArray(itemData)) {
            return null;
        }
        else{
        	console.log(itemData);
			itemData.forEach((item, i)=>{
				console.log(item.fullName);
				var itemStyle = this.getInitialStyle().itemDefault;
				if(i==0)
					itemStyle.borderTopWidth=1;
				itemView.push(
						<ListItem key={'item'+i} style={itemStyle}>
                        	<Text>{item.fullName+'\n'+item.shortName}</Text>
                        </ListItem>
					);
			});
        }
        return itemView;
	}
	
	render() {
		if(this.state.show){
		return (
				<List >
					{this.renderChildren()}
				</List>
			);
		}
		else{
			return null;
		}
	}
}