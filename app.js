
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import { AppRegistry, StyleSheet, Modal, Image, Platform } from 'react-native';
 import { Spinner, Text, View, Content, 
          Container, Header, Title, 
          Button, Icon, InputGroup, 
          Input, ListItem, List, 
          Radio, CheckBox, Thumbnail, 
          Card, CardItem, H3 } from 'native-base';

import  {FloatSearchResult} from './AutoSearchResult';
import  {Dispatcher} from './minFlux/Dispatcher'
import  {LocatorSuggestion} from './uscapi/LocatorSuggestion';

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
      this._searchBar.nextState = (eventKey, dataKeys)=>{
                                        if(eventKey=='queryClear'){
                                        console.log('clicked'); 
                                        this._searchBar._textInput.setNativeProps({text: ''});;
                                        this.queryChange('');
                                        this._searchBar.setState({});
                                        }
                                        if(eventKey=='suggestionReady'){
                                          var query = this.dispather.getData('query');
                                          if(query)
                                            this.queryChange(query);
                                        }
                                  };
      this.locatorSuggestion.init(this.dispather);
    }

    render() {

        return (
            <Container>
                <Header style={{backgroundColor: '#990000' }}>
                  <Title style={{fontSize: 36, flex: 1}}>USC GO</Title>
                </Header>
                <Content>
                  
                  <InputGroup borderType='rounded' style={{margin: 20}}>
                        <Icon style={{marginLeft:10}} name='ios-search'/>
                        <Input 
                          placeholder='Search' style={{height: 60, fontSize: 24}} 
                          ref={(searchBar)=>{this._searchBar=searchBar;}} 
                          onChangeText={text=>this.queryChange(text)}/>
                        <Button large transparent  style={{paddingTop : 15, width:40}} 
                        onPress={()=>this.clearQuery()}><Icon name='ios-close'/></Button>
                  </InputGroup>
                  <FloatSearchResult 
                    ref={(searchResult)=>{this._searchResult=searchResult;}} 
                    store={this.dispather}/>
                
                </Content>
            </Container>
         );
     }

    queryChange(text){
        var query=text.trim();
        if(query.length>0){
          if(!this.locatorSuggestion.isIndexReady()){
            this.dispather.dataStore('query', query);
            this.dispather.triger('waitSuggestion',[]);
            return;
          }
          var suggestionShow=[];
          var suggestions=this.locatorSuggestion.getSuggestion(query);
          suggestions.forEach((s)=>{
            suggestionShow.push({fullName:s.data.name,
                                 shortName:s.data.code});
          });
          this.dispather.dataStore('querySuggestion', suggestionShow);
        }
        else{
          console.log('clear');
          this.dispather.dataStore('querySuggestion', []);
        }
        this.dispather.triger('queryChange', 'querySuggestion');
    }

    clearQuery(){
        this.dispather.triger('queryClear','');
    }
 }


AppRegistry.registerComponent('AwesomeProject', () => nativebaseTutorial);