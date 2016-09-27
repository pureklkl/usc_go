'use strict';
export class Trie{
	stringFilter(str){
		return str.toLowerCase().replace(/\s/g,'');
	}
	optimize(node){
		var modify=[];
		for(var child in node.children){
			if(node.children[child].cnum==1){
				var concat = child;
				var nextNode = node.children[child];
				do{
					var singleName=Object.keys(nextNode.children)[0];
					concat+=singleName;
					nextNode = nextNode.children[singleName];
				}while(nextNode.cnum==1)
				nextNode.data=node.children[child].data;
				modify.push({oldkey:child, newKey:concat, newChild:nextNode});
			}
		}
		if(modify.length>0){
			for(var opChild in modify){
				node.children[modify[opChild].oldkey]=modify[opChild].newKey;
				node.children[modify[opChild].newKey]=modify[opChild].newChild;
			}
		}
		for(var child in node.children){
			if(typeof node.children[child]=== "object")
				this.optimize(node.children[child]);
		}
	}
	find(query){
		query=this.stringFilter(query);
		var letters = query.split(""), cur = this.trie, result=cur.data;
		for(var i=0;i<letters.length;i++){
			var l = letters[i]; 
			if(cur.children[l]!=null){
				if(typeof cur.children[l]=== "object"){
					result=cur.children[l].data;
					cur = cur.children[l];
				}
				else{
					var maxl=letters.length>i+cur.children[l].length?i+cur.children[l].length:letters.length;
					if(query.substring(i, maxl)==cur.children[l]&&maxl<letters.length){
							i=maxl-1;
							cur=cur.children[cur.children[l]];
					}
					else{
						result=[];
						cur.children[cur.children[l]].data.forEach((d)=>{
							if(d.key.substring(i).startsWith(query.substring(i,maxl)))
								result.push(d);});
						return result;
					}
				}
			}
			else{
				return result;
			}
		}
		return result;
	}
	insert(word, node){
		if(!(word&&node))
			return null;
		node={key:this.stringFilter(word), data:node};
		var letters = node.key.split(""), cur = this.trie;
		
		for ( var j = 0; j < letters.length; j++ ) {

			var letter = letters[j], pos = cur.children[ letter ];

			if ( pos == null ) {
				cur.cnum++;
				cur = cur.children[ letter ] = new trieNode();
			} else {
				cur = cur.children[ letter ];
			}
			cur.data=cur.data.concat(node);
		}		
	}
	build(data, keyfield){
		this.trie=new trieNode;
		if(Array.isArray(data)){
			for ( var i = 0, l = data.length; i < l; i++ ) {
				if(Array.isArray(keyfield)){
					keyfield.forEach((fieldname)=>{this.insert((data[i])[fieldname], data[i])});
				}
			}

		}
		this.optimize(this.trie);
	}
}

class trieNode{
	constructor(){
		this.cnum=0;
		this.children={};//letter-node map
		this.data=[];//data
	}
}