import Store from 'react-native-store';
import {Trie} from './Trie';
import {AsyncStorage} from 'react-native';

const DB = {
    'USC_GO': Store.model('USC_GO')
}

export class USCApiHelper{
	constructor(){
		this.all_location_url = 'http://web-app.usc.edu/maps/all_map_data2.js';
		this.all_location_storage_key='@USC_GO:USC_ALL_LOCATION_KEY';
		this.date_valid=1000*60*60*24*30;//refresh every 30 days
		this.usc_filter = {where : {dataName : {eq : this.all_location_storage_key}}};
		//AsyncStorage.clear();
	}
	fetchdata(){
		return fetch(this.all_location_url).
				then((response) => {console.log(response.status); return response.text();},
					  (reason)=>console.log(reason)).
				then((responseText) => {
					var value = this.parseWraper(responseText);
					
		        	this.locationData={	dataName :this.all_location_storage_key,
		        						date:Date.now(),
		        						data:value};
		        	
		        	console.log(value[2]);
		        	this.addData();
		    		return new Promise((resolve, reject)=>{
								resolve(this.locationData);
							});
					},
					(reason)=>console.log(reason)
				);
	}
	loadData(){
		return this.findData().then(()=>{
				var needFetch=false;
				if(this.locationData==null){
						needFetch=true;
						alert('local data not found download new one');
						console.log("new data");
					}
					else if(Date.now()-this.locationData.date>=this.date_valid){
						needFetch=true;
						//this.updateData();
						console.log("updata data");
					}
					else{
						console.log("get data");
					}
					if(needFetch){
						return this.fetchdata();
					}else{
						return new Promise((resolve, reject)=>{
							resolve(this.locationData);
						});
					}
				});
	}

	
	parseWraper(value){
		if(!value)
			return null;
		else{

			return eval(value);
		}
	}
	addData(){
		//DB.USC_GO.add(this.locationData);
		try{
			AsyncStorage.setItem(this.all_location_storage_key, JSON.stringify(this.locationData),
			()=>{AsyncStorage.getItem(this.all_location_storage_key,
				(error, result)=>{
									if(result!=null){
										alert('local data refreshed'); 
										console.log('find');
									}
								})
				}
			);
		}catch(erro){
			console.log(erro);
		}
	}
	findData(){
		//DB.USC_GO.find({where : {dataName : {eq : this.all_location_storage_key}}})
		//.then((resp)=>{this.locationData = resp});
		try{
			return AsyncStorage.getItem(this.all_location_storage_key,
				(error, result)=>{
					console.log(error);
					if(result!=null)
						this.locationData=JSON.parse(result);
					else
						console.log('not found');});
		}catch(erro){
			console.log(erro);
		}
	}
	//seems not needed
	updateData(){
		AsyncStorage.removeItem(this.all_location_storage_key);
		this.addData();
		//DB.USC_GO.update(this.locationData, {where : {dataName : {eq : this.all_location_storage_key}}});
	}
}