'use strict';

class _Debug {
	
	constructor(){
		this.mode = true;
	};

	console={log:(info)=>{
					if(this.mode)
						console.log(info);
				}
			};
}

_Debug = new _Debug();

export {_Debug};