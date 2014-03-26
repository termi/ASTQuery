"use strict";

class TokenList {
	_reset() {
		this._keysMap = {};
		this._lengthChanged = false;
		this._length = 0;
	}

	constructor(...tokens) {
		this._reset();

		this.add(...tokens);
	}

	_update() {
//		this._lengthChanged = true;
		this.length = Object.keys(this._keysMap).length;
	}

//	get length() {
//		if ( this._lengthChanged ) {
//			this._length = Object.keys(this._keysMap).length;
//			this._lengthChanged = false;
//		}
//		return this._length;
//	}

	add(...tokens) {
		for ( let token of tokens ) {
			this._keysMap[token] = null;
		}
		this._update();
	}

	remove(...tokens) {
		for ( let token of tokens ) {
			delete this._keysMap[token];
		}
		this._update();
	}

	contains(...tokens) {
		const keysMap = this._keysMap;
		let match = false;

		for ( let token of tokens ) {
			if ( !(match = keysMap[token] !== void 0) ) {
				break;
			}
		}

		return match;
	}

	toggle(token, force) {
		if ( force === true || (this._keysMap[token] === void 0 && force !== false) ) {
			this.add(token);
		}
		else {
			this.remove(token);
		}
	}

	clean() {
		this._reset();
	}

	toString(separator = " ") {
		return Object.keys(this._keysMap).join(separator);
	}
}

module.exports = TokenList;
