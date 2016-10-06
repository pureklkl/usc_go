import {USCApiHelper} from './USCApiHelper'
import {Trie} from './Trie';
export class LocatorSuggestion{
	constructor(){
		this.dataSource = new USCApiHelper();
		this.indexReady=false;
	}
	init(dispather){
		var fetched=false;
		this.data=this.dataSource.loadData().then((locationData)=>{
			console.log('fetched');
			this.locationData=locationData.data;
			console.log(this.locationData[2]);
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
			return this.trieIndex.find(query);
		}
		else{
				//longest substring + edit distance
		}
	}

	isIndexReady(){
		return this.indexReady;
	}
}