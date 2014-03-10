
const {default: reporter} = require('nodeunit').reporters
	, path = require('path');;

reporter.run(['specs/on'].map( (moduleName) => path.join(__dirname, `${moduleName}.js`) ));
