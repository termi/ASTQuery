"use strict";

const BUILD_VERSION = "%%BUILD_VERSION%%";

const assert = function(expect, msg) {
	if( expect != true ) {
		throw new Error(msg || "");
	}
};

let temp = [];temp = [x for(x of temp)];//avoid es6-transpiler 0.7.8 GET_ITER bug

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
			node["$parentProp"] = parentProp;

			if( childIndex !== void 0 ) {
				node["$childIndex"] = childIndex;
			}

			(parentNode["$children"] || (parentNode["$children"] = [])).push(node);
		}

		if ( prevNode )prevNode["$nextElementSibling"] = node;
		node["$previousElementSibling"] = prevNode;
		this._prevNode = node;
	}

	on(selectorsMap, {prefix} = {}) {
		assert(typeof selectorsMap === 'object');

		let typeSelectorsMap = Object.create(null);
		typeSelectorsMap["*"] = [];
		let nameSelectorsMap = Object.create(null);
		let isPostCallbacks = false;

		let prefixLength = 0;
		if ( prefix !== void 0 ) {
			prefix = String(prefix);
			prefixLength = prefix.length;
		}

		for( let selector in selectorsMap ) if( selectorsMap.hasOwnProperty(selector) ) {
			let callback = selectorsMap[selector];

			if ( prefix ) {
				if ( selector.substring(0, prefixLength) !== prefix ) {
					continue;
				}
				selector = selector.substring(prefixLength);
			}

			assert(typeof callback === 'function', 'Callback must be a function');

			selector = selector.trim();

			let isPostCallback = selector[0] === '^';
			if ( isPostCallback ) {
				selector = selector.substr(1).trim();//TODO:: trimLeft()
				isPostCallbacks = true;
			}

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

				callbacks.push({callback, attrRules, isPostCallback});
			}
		}

		{
			let matchedCallbacks = []
				, {onnode} = this.options
			;

			if ( typeof onnode !== 'function' ) {
				onnode = void 0;
			}

			let callback = (node, parentNode, parentProp, childIndex, isPost) => {
				for( let {callback, attrRules, isPostCallback} of [...typeSelectorsMap["*"], ...(typeSelectorsMap[node.type] || nameSelectorsMap[node.name] || [])] ) {
					if( isPost == isPostCallback && (!attrRules || !attrRules.length || matchAttributes(node, attrRules)) ) {
						matchedCallbacks.push({callback, node});
					}
				}

				if ( onnode ) {
					if ( onnode(node, parentNode, parentProp, childIndex) === false ) {
						return;
					}
				}
			};

			this.traverse(this.ast, callback, isPostCallbacks ? callback : void 0);

			for( let {callback, node} of matchedCallbacks ) {
				callback.call(selectorsMap, node);
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

	traverse(node, pre, post) {
		if ( pre === void 0 ) {
			if ( typeof node === 'function' ) {//astQuery.traverse(function(anyNode){})
				pre = node;
				node = this.ast;
			}
			else if ( typeof post === 'function' ) {
				pre = () => {};
			}
		}
		if ( typeof post !== 'function' ) {
			post = void 0;
		}

		let prepared = this._prepared;

		let visit = (node, parentNode, parentProp, childIndex) => {
			if ( !prepared ) {
				this._prepareNode(node, parentNode, parentProp, childIndex);
			}

			if ( pre(node, parentNode, parentProp, childIndex, false) === false ) {
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

			if ( post ) {
				if ( post(node, parentNode, parentProp, childIndex, true) === false ) {
					return false;
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
