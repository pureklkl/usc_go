module.exports = {
    "plugins": [
 		"react",
        "react-native"
    ],
  	"settings": {
    	"react": {
      		"createClass": "createClass", // Regex for Component Factory to use, default to "createClass" 
      		"pragma": "React",  // Pragma to use, default to "React" 
      		"version": "15.0" // React version, default to the latest React stable release 
    	}
  	},
  	"parserOptions": {
      	"ecmaVersion": 7,
      	"sourceType": "module",
    	"ecmaFeatures": {
      		"jsx": true,
    }
  },
  "syntax_map": {
  "JavaScript (Babel)": "javascript",
  }
};