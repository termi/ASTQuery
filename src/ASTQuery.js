"use strict";

const BUILD_VERSION = "%%BUILD_VERSION%%";

const assert = function(expect, msg) {
	if( expect != true ) {
		throw new Error(msg || "");
	}
};

const { parseSelector, parseAttrSelector, matchAttributes } = require('./querySelector.js');

class ASTQuery {
	static getVisitorKeys(visitorKeysName) {
		if ( typeof visitorKeysName === 'object' ) {
			return visitorKeysName;
		}
		else {
			visitorKeysName = String(visitorKeysName).toLowerCase();
			try {
				return require(`./keys/${visitorKeysName}.js`);
			}
			catch(e) {
				throw new Error(`Unrecognized type of visitor keys "${visitorKeysName}"`);
			}
		}
	}

	constructor(ast, visitorKeys, options = {}) {
		this.visitorKeys = ASTQuery.getVisitorKeys(visitorKeys);

		this.ast = ast;

		this.options = options;

		ast["__prepared__"] = false;
		this._sourceIndex = 0;
		this._prevNode = void 0;
	}

	_prepareNode(node, parentNode, parentProp, childIndex) {
		let prevNode = this._prevNode;

		node["$sourceIndex"] = this._sourceIndex++;

		if( parentNode ) {
			node["$parentNode"] = parentNode;
			node["$parentProp"] = propName;

			if( childIndex !== void 0 ) {
				node["$childIndex"] = childIndex;
			}

			(parentNode["$children"] || (parentNode["$children"] = [])).push(node);
		}

		if ( prevNode )prevNode["$nextElementSibling"] = node;
		node["$previousElementSibling"] = prevNode;
		this._prevNode = node;
	}

	on(selectorsMap) {
		assert(typeof selectorsMap === 'object');

		let typeSelectorsMap = Object.create(null);
		typeSelectorsMap["*"] = [];
		let nameSelectorsMap = Object.create(null);

		for( let selector in selectorsMap ) if( selectorsMap.hasOwnProperty(selector) ) {
			let callback = selectorsMap[selector];
			assert(typeof callback === 'function', 'Callback must be a function');

			for( let [ , , typeName, nameValue, className, attrRules = [], pseudoClass, isParentSelector, , nextRule] of parseSelector(selector) ) {

				if ( nextRule ) {
					throw new Error(`Complex selectors doesn't supported for now`);
				}

				if ( className || pseudoClass || isParentSelector ) {
					throw new Error(`Not supported for now "${(className || pseudoClass || (isParentSelector ? "!" : ""))}"`);
				}

				let callbacks;

				if( nameValue ) {
					if ( typeName ) {
						attrRules.push(parseAttrSelector(`[type=${typeName}]`)[0]);
					}

					callbacks = nameSelectorsMap[nameValue];
					if ( !callbacks ) {
						callbacks = nameSelectorsMap[nameValue] = [];
					}
				}
				else if( typeName ) {
					if ( nameValue ) {
						attrRules.push(parseAttrSelector(`[name=${nameValue}]`)[0]);
					}

					callbacks = typeSelectorsMap[typeName];
					if ( !callbacks ) {
						callbacks = typeSelectorsMap[typeName] = [];
					}
				}
				else {
					callbacks = typeSelectorsMap["*"];
				}

				callbacks.push({callback, attrRules});
			}
		}

		{
			let matchedCallbacks = []
				, {onnode} = this.options
			;

			if ( typeof onnode !== 'function' ) {
				onnode = void 0;
			}

			traverse(this.ast, (node, parentNode, parentProp, childIndex) => {
				for( let {callback, attrRules} of [...typeSelectorsMap["*"], ...(typeSelectorsMap[node.type] || nameSelectorsMap[node.name] || [])] ) {
					if( !attrRules || !attrRules.length || matchAttributes(node, attrRules) ) {
						matchedCallbacks.push({callback, node});
					}
				}

				if ( onnode ) {
					if ( onnode(node, parentNode, parentProp, childIndex) === false ) {
						return;
					}
				}
			});

			for( let {callback, node} of matchedCallbacks ) {
				callback(node);
			}
		}

		this.ast["__prepared__"] = true;
	}

	findAll(root, selector, onlyFirst) {
		// TODO::
	}

	find(root, selector) {
		return this.findAll(root, selector, true)[0];
	}

	match(node, selector, scope) {
		// TODO::
	}

	traverse(node, callback) {
		if ( callback === void 0 && typeof node === 'function' ) {
			callback = node;
			node = this.ast;
		}

		let prepared = this._prepared;

		let visit = (node, parentNode, parentProp, childIndex) => {
			if ( !prepared ) {
				this._prepareNode(node, parentNode, parentProp, childIndex);
			}

			if ( callback(node, parentNode, parentProp, childIndex) === false ) {
				return false;
			}

			for ( const propName of (this.visitorKeys[node.type] || []) ) {
				const child = node[propName];

				if ( Array.isArray(child) ) {
					let childIndex = 0;
					for ( let _child of child ) if ( _child ) {
						if ( visit(_child, node, propName, childIndex++) === false ) {
							return false;
						}
					}
				}
				else if ( child ) {
					if ( visit(child, node, propName) === false ) {
						return false;
					}
				}
			}
		};

		if ( prepared ) {
			this._sourceIndex = 0;
			this._prevNode = void 0;
			this._prepared = true;
		}

		visit(node);
	}
}
ASTQuery.version = BUILD_VERSION;

module["exports"] = ASTQuery;
