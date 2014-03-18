"use strict";
const path = require('path');

module.exports = {
	getES5Module(moduleName) {
		return require(path.join(__dirname, '..', 'es5', moduleName))
	}

	, getAstTree(astType, index) {
		let trees = require(path.join(__dirname, 'ast', astType));
		return Array.isArray(trees) ? trees[index] : trees;
	}
};
