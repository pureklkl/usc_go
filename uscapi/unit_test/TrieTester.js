'use strict';

/*var smalltest=[{w:'a'},{w:'abc'},{w:'b'},{w:'bc'},{w:'bcd'},{w:'bce'}];

var t = new Trie();
t.build(smalltest, ['w']);
var query=['a','abc','b','bc','bcd','bce'];

query.forEach((q)=>{
	var res=t.find(q);
	var str='';
	for (var i in res){
    str+=res[i].data.w+',';
	}
	document.write(str);
	document.write("<br>");
});
*/

var t = new Trie();
t.build(markers, ['name','code']);
var query=['sal'];

query.forEach((q)=>{
	var res=t.find(q);
	var str='';
	for (var i in res){
    str+=res[i].data.name+'('+res[i].data.code+')';
	}
	document.write(str);
	document.write("<br>");
});