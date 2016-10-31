import {USCApiHelper} from './USCApiHelper'
import {Trie} from './Trie';

import {_Debug} from '../debugHelper/wraper';

export class LocatorSuggestion{
	
	constructor(){
		this.dataSource = new USCApiHelper();
		this.indexReady=false;
	}

	init(dispather){
		var fetched=false;
		this.data=this.dataSource.loadData().then((locationData)=>{
			_Debug.console.log('fetched');
			this.locationData=locationData.data;
			_Debug.console.log(this.locationData[2]);
			this.buildIndex();
			this.indexReady=true;
			dispather.triger('suggestionReady',[]);
		});
	}

	buildIndex(){
		this.trieIndex=new Trie();
		this.trieIndex.build(this.locationData, ['code','name']);
	}

	getSuggestion(query){
		if(this.trieIndex){
			var result = this.trieIndex.find(query);
			var idset={}, l=0;
			for(var i=0;i<result.length-1;i++){
				result[l]=result[i];
				if(idset[result[i].data.id]!=true){
					idset[result[i].data.id]=true;
					l++;
				}
				
			}
			return result.slice(0,l);
		}
		else{
				//longest substring + edit distance
		}
	}

	isIndexReady(){
		return this.indexReady;
	}
}