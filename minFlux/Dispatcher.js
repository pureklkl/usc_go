export class Dispatcher{
	//todo, add events chain
	constructor() {
    	this.eventMap={};
    	this.dataMap={};
  	}
	viewRegist(eventKey, obj){
		if(this.eventMap[eventKey])
			this.eventMap[eventKey]=[this.eventMap[eventKey], obj];
		else
			this.eventMap[eventKey]=[obj];
	}
	dataStore(dataKey, data){
		this.dataMap[dataKey]=data;
	}
	getData(dataKey){
		return this.dataMap[dataKey];
	}
	getView(eventKey){
		return this.eventMap[eventKey];
	}
	triger(eventKey, dataKeys){
		views=this.eventMap[eventKey];
		if(!Array.isArray(views))
			return false;
		else{
			views.forEach((view)=>(view.nextState(eventKey, dataKeys)));
			return true;
		}
	}
}