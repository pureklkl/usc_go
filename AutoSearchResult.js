import React, { Component } from 'react';
import {ListView, Platform, TouchableHighlight, TouchableOpacity, Text, View } from 'react-native';
import NativeBaseComponent from './node_modules/native-base/Components/Base/NativeBaseComponent';
import { Spinner, ListItem} from 'native-base';
import computeProps from './node_modules/native-base/Utils/computeProps';
import {_Debug} from './debugHelper/wraper';

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
					_Debug.console.log(data);
					this.itemData=data;
					_Debug.console.log(this.itemData);
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

		propTypes: {
			style : React.PropTypes.object
		};

		getInitialStyle() {
			return {
				default: {
					height:400
				},
				itemDefault: {
					backgroundColor: 'white',
					marginLeft: 30,
					marginRight: 30,
					borderLeftWidth: 1,
					borderRightWidth: 1,
					paddingTop:10,
					paddingBottom:10,
				//borderBottomWidth: 1,
				paddingLeft: 10,
				paddingRight: 10
			}
		}
	}

	prepareRootProps(){
		var defaultProps = {
			style: this.getInitialStyle().default
		};

		return computeProps(this.props, defaultProps);
	}

	renderChildren(){
		var itemView = [];
		var itemData = this.itemData;
		_Debug.console.log(itemData);
		if(!Array.isArray(itemData)) {
			return null;
		}
		else{
			_Debug.console.log(itemData);
			itemData.forEach((item, i)=>{
				_Debug.console.log(item.fullName);
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
			<TouchableOpacity onPress={() => {
				this.props.store.dataStore('selectlocationData', item.data);
				this.props.store.triger('selectLocation','selectlocationData');
				this.setState({show:false, wait:false});
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
		_Debug.console.log(this.state);
		if(this.state.show){
			if(!this.state.wait){
				this.warperResult(this.itemData);
				const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
				var dataSource = ds.cloneWithRows(this.itemDataWraper);
				return (
					
					<ListView
					{...this.prepareRootProps()}
					dataSource={dataSource} 
					renderRow={(item)=>this.renderPerChildren(item)} 
					ref={(list)=>{this.listResp=list;}}/>

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
			_Debug.console.log('clear');
			return null;
		}
	}
}

