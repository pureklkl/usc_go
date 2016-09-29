 import React, { Component } from 'react';
 import {ListView, Platform, TouchableHighlight, TouchableOpacity, Text, View } from 'react-native';
 import NativeBaseComponent from './node_modules/native-base/Components/Base/NativeBaseComponent';
 import { Spinner, Content, 
          Container, Grid, Col, 
          Button, Icon, InputGroup, 
          Input, ListItem, List, 
          Radio, CheckBox, Thumbnail, 
          Card, CardItem, H3 } from 'native-base';
import { KeyboardAwareListView } from 'react-native-keyboard-aware-scroll-view';

export class FloatSearchResult extends NativeBaseComponent {

	constructor(){
		super();
		this.state={show:false,
					wait:false};
	}

	nextState(eventKey, dataKeys){
		switch(eventKey){
			case 'queryChange' : 
				data = this.props.store.getData(dataKeys);
					if(Array.isArray(data)&&data.length>0){
						console.log(data);
						this.itemData=data;
						console.log(this.itemData);
						this.setState({show:true,
									   wait:false});
					}
					else{
						this.setState({show:false,
									   wait:false});
					}break;
			case 'waitSuggestion':
				this.setState({show:true,
							   wait:true});
				break;
		}
	}

	getInitialStyle() {
		return {
			default: {
			},
			itemDefault: {
				backgroundColor: 'white',
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

	setNativeProps (nativeProps) {
    	this._listChilde.setNativeProps(nativeProps);
  	}

	renderPerChildren(item){
		var itemStyle = this.getInitialStyle().itemDefault;
		if(item.key==0)
			itemStyle.borderTopWidth=1;
		return (
				<View style={itemStyle}>
				<TouchableOpacity onPress={() => {//this._pressRow(rowID);
          								   }}>
					<View>
						<Text>{item.data.fullName+'\n'+item.data.shortName}</Text>
					</View>
				</TouchableOpacity>
				</View>
			);
	}
	
	warperResult(items){
		this.itemDataWraper=[];
		items.forEach((item,index)=>{
			this.itemDataWraper.push({key:index,
									  data:item});
		});
	}
	renderWait(){
		var itemStyle = this.getInitialStyle().itemDefault;
		return (

				<ListItem style={itemStyle}>
					<Spinner />
				</ListItem>
			);
	}
	componentDidUpdate(){
		if(this.listResp)
			this.listResp.getScrollResponder().scrollTo({x:0,y:0,animated:true});
	}
	render() {
		console.log(this.state);
		if(this.state.show){
			if(!this.state.wait){
				this.warperResult(this.itemData);
				const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
				var dataSource = ds.cloneWithRows(this.itemDataWraper);
				return (
						<Grid>
							<Col style={{height: 450}}>
							<ListView dataSource={dataSource} 
							  	renderRow={(item)=>this.renderPerChildren(item)} 
							  	ref={(list)=>{this.listResp=list;}}/>
							</Col>
						</Grid>
						);
			}
			else
				return (
						<List >
							{this.renderWait()}
						</List>
					);
		}
		else{
			console.log('clear');
			return null;
		}
	}
}