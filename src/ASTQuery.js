"use strict";

const BUILD_VERSION = "%%BUILD_VERSION%%";

const { parseSelector, parseAttrSelector } = require('./parseSelector.js');
const { matchAttributes } = require('./matchSelector.js');
const TokenList = require('./TokenList.js');

const assert = function(expect, msg) {
	if( expect != true ) {
		throw new Error(msg || "");
	}
};

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

		this._sourceIndex = 0;
		this._prevNode = void 0;

		this.reset();
	}

	reset() {
		this.mods = new TokenList;

		this._selectorGroup = 0;
		this._typeSelectorsMap = Object.create(null);
		this._typeSelectorsMap["*"] = [];
		this._nameSelectorsMap = Object.create(null);
//		this._classSelectorsMap = Object.create(null);
		this._preudoSelectorsMap = Object.create(null);

		this.callbacksCollected = false;
	}

	get callbacksCollected() {
		return this._callbacksCollected;
	}

	set callbacksCollected(val) {
		if ( val === false ) {
			this._matchedCallbacks = void 0;
		}
		this._callbacksCollected = val;
		return val;
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

	_isInMods(defaultMod, ...mods) {
		if ( !mods.length && !this.mods.length ) {
			return true;
		}

		return mods.every( (mod) => {
			if ( mod == '*' ) {
				return true;
			}

			if ( defaultMod ) {
				if ( Array.isArray(defaultMod) ) {
					if ( defaultMod.indexOf(mod) !== -1 ) {
						return true;
					}
				}
				else if ( `${defaultMod}` === `${mod}` ) {
					return true;
				}
			}

			return this.mods.contains(mod);
		} );
	}

	_getSelectorMods(selector) {
		selector = selector.trim();

		let isPost = selector[0] === '^';
		if ( isPost ) {
			selector = selector.substr(1).trim();//TODO:: trimLeft()
		}

		let mods = selector[0] === '?';
		if ( mods ) {
			let index = selector.indexOf(" ");
			let isUniversal = false;

			mods =
				selector.substr(1, index).split("?")
					.map( (ns) => {
						ns = ns.trim();
						if ( ns == "" || ns == "*" ) {
							isUniversal = true;
						}
						return ns;
					} )
			;
			if ( isUniversal ) {
				mods = ["*"];
			}

			selector = selector.substr(index).trim();//TODO:: trimLeft()
		}
		else {
			mods = void 0;
		}

		return {
			selector
			, isPost
			, mods
		}
	}

	addListener(sel, callback, {group = this._selectorGroup, mod, defaultMod, self} = {}) {
		assert(typeof callback === 'function', 'Callback must be a function');

		group = group | 0;

		let typeSelectorsMap = this._typeSelectorsMap
			, nameSelectorsMap = this._nameSelectorsMap
//			, preudoSelectorsMap = this._preudoSelectorsMap
		;

		let {selector, isPost, mods} = this._getSelectorMods(`${sel}`);
		if ( isPost ) {
			this._isPostCallbacks = true;
		}

		for ( let [ , , typeName, nameValue, className, attrRules = [], pseudoClass, isParentSelector, , nextRule] of parseSelector(selector) ) {

			if ( nextRule ) {
				throw new Error("Complex selectors doesn't supported for now");
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

			callbacks.push({callback, attrRules, isPost, group, mods, defaultMod, self});
		}
	}

	on(selectorsMap, {prefix, mod, defaultMod, group = this._selectorGroup++} = {}) {
		assert(typeof selectorsMap === 'object');

		let prefixLength = 0;
		if ( prefix !== void 0 ) {
			prefix = String(prefix);
			prefixLength = prefix.length;
		}

		for ( let selector in selectorsMap ) if ( selectorsMap.hasOwnProperty(selector) ) {
			let callback = selectorsMap[selector];

			if ( prefix ) {
				if ( selector.substring(0, prefixLength) !== prefix ) {
					continue;
				}
				selector = selector.substring(prefixLength);
			}

			this.addListener(selector, callback, {mod, defaultMod, group, self: selectorsMap})
		}
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
		let {onpreparenode} = this.options;
		if ( typeof onpreparenode !== 'function' ) {
			onpreparenode = void 0;
		}

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

				if ( onpreparenode ) {
					onpreparenode(node, parentNode, parentProp, childIndex);
				}
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

		if ( !prepared ) {
			this._sourceIndex = 0;
			this._prevNode = void 0;
			this._prepared = true;
		}

		visit(node);
	}

	_collectCallbacks() {
		if ( this.callbacksCollected ) {
			return;
		}

		let typeSelectorsMap = this._typeSelectorsMap
			, nameSelectorsMap = this._nameSelectorsMap
//			, preudoSelectorsMap = this._preudoSelectorsMap
			, matchedCallbacks = this._matchedCallbacks = []
			, {onnode} = this.options
			, universalSelectorsMap = typeSelectorsMap["*"]
		;

		let isPostCallbacks = this._isPostCallbacks;

		if ( typeof onnode !== 'function' ) {
			onnode = void 0;
		}

		let callback = (node, parentNode, parentProp, childIndex, isPostCallback) => {
			if ( onnode && !isPostCallback ) {
				if ( onnode(node, parentNode, parentProp, childIndex) === false ) {
					return false;
				}
			}

			let selectorsMap = [...universalSelectorsMap, ...(typeSelectorsMap[node.type] || nameSelectorsMap[node.name] || [])];

			for ( let {callback, attrRules, isPost = false, mods, group, self} of selectorsMap ) {
				if( isPost == isPostCallback
					&& (!attrRules || !attrRules.length || matchAttributes(node, attrRules))
				) {
					let matchedCallbacksGroup = matchedCallbacks[group];
					if ( !matchedCallbacksGroup ) {
						matchedCallbacksGroup = matchedCallbacks[group] = [];
					}
					matchedCallbacksGroup.push({callback, node, mods, self});
				}
			}
		};

		this.traverse(this.ast, callback, isPostCallbacks ? callback : void 0);
	}

	apply({mod, group} = {}) {//TODO:: apply({group: index}) tests
		if ( group !== void 0 ) {
			group = +group;
			if ( isNaN(group) ) {
				group = void 0;
			}
		}

		if ( mod !== void 0 ) {
			if ( Array.isArray(mod) ) {
				this.mods.add(...mod);
			}
			else {
				this.mods.add(mod);
			}
		}

		{
			this._collectCallbacks();
			let matchedCallbacks = this._matchedCallbacks;

			if ( group !== void 0 ) {
				if ( matchedCallbacks[group] ) {
					for ( let {callback, node, mods, defaultMod, self = null} of matchedCallbacks[group] ) {
						if ( !mods && !this.mods.length || mods && this._isInMods(defaultMod, ...mods) ) {
							callback.call(self, node, this);
						}
					}
				}
			}
			else {
				for ( let matchedCallbacksGroup of matchedCallbacks ) {
					for ( let {callback, node, mods, defaultMod, self = null} of matchedCallbacksGroup ) {
						if ( !mods && !this.mods.length || mods && this._isInMods(defaultMod, ...mods) ) {
							callback.call(self, node, this);
						}
					}
				}
			}
		}

		if ( mod !== void 0 ) {
			if ( Array.isArray(mod) ) {
				this.mods.remove(...mod);
			}
			else {
				this.mods.remove(mod);
			}
		}
	}

	getAST({cleanup}) {//TODO:: tests
		let ast = this.ast;

		if ( cleanup === true ) {
			this._prepared = false;
			this.callbacksCollected = false;
			let visitorKeysMaps = {};

			this.traverse(ast, (node) => {
				let visitorKeysMap = visitorKeysMaps[node.type];
				if ( !visitorKeysMap ) {
					visitorKeysMap = visitorKeysMaps[node.type] = this.visitorKeys[node.type].reduce( (val, name) => {val[name] = null;return val}, {});
				}

				for( let propName in node ) if ( node.hasOwnProperty(propName) ) {
					if ( visitorKeysMap[propName] === void 0 ) {
						delete node[propName];
					}
				}
			});
		}

		return ast;
	}
}
ASTQuery.version = BUILD_VERSION;

module["exports"] = ASTQuery;
