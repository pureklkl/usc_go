import Store from 'react-native-store';
import {Trie} from './Trie';

const DB = {
    'USC_GO': Store.model('USC_GO')
}

export class USCApiHelper{
	constructor(){
		this.all_location_url = 'http://web-app.usc.edu/maps/all_map_data2.js';
		this.all_location_storage_key='@USC_GO:USC_ALL_LOCATION_KEY';
		this.date_valid=1000*60*60*24*30;//refresh every 30 days
		this.usc_filter = {where : {key : {eq : this.all_location_storage_key}}};
	}
	async fetchdata(){
		await fetch(this.all_location_url).
		then((response) => {console.log(response.status); return response.text();},
			  (reason)=>console.log(reason)).
		then((responseText) => {
			var value = this.parseWraper(responseText);
			
        	this.locationData={	key :this.all_location_storage_key,
        						date:Date.now(),
        						data:value};
        	
        	console.log(value[2]);
        	if(!this.findData())
        		this.addData();
        	else
        		this.updateData();
			},
			(reason)=>console.log(reason)
		)
		return this.locationData;
	}
	loadData(){
		return this.fetchdata();
	}

	
	parseWraper(value){
		if(!value)
			return null;
		else{

			return eval(value);
		}
	}
	addData(){
		DB.USC_GO.add(this.locationData)
	}
	findData(){
		return DB.USC_GO.find({where : {key : {eq : this.all_location_storage_key}}});
	}
	updateData(){
		DB.USC_GO.update(this.locationData, {where : {key : {eq : this.all_location_storage_key}}});
	}
}