"use strict";

const
	/** @type {RegExp} @const */
	RE__queryComplexSelector__selectorsMatcher = /(^|,|>|\+|~|\s).+?(?=[,>+~\s]|$)/g
	/*TODO::CSS4 Reference combinator
	 , RE__queryComplexSelector__selectorsMatcher = /(^|,|\>|\+|~|\/| ).+?(?=[,>+~/ ]|$)/g

	 */
	/** @type {RegExp} @const */
	, RE__queryCompoundSelector__selectorMatch = /^([,>+~\s])?([\w\-\|\*]*)#?([\w-]*)((?:\.?[\w-])*)(\[.+\])?(?::([^!]+))?(!)?$/ ///^([,>+~ ])?(\$)?([\w\-\|\*]*)\#?([\w-]*)((?:\.?[\w-])*)(\[.+\])?(?:\:(.+))?$/
	/*TODO::CSS4 Reference combinator
	 , RE__queryCompoundSelector__selectorMatch = /^([,>+~/ ])?(\$)?([\w\-\|\*]*)\#?([\w-]*)((?:\.?[\w-])*)(\[.+\])?(?:\:(.+))?$/*/

	/** @enum {number} @const */
	, SELECTOR_ATTR_OPERATIONS_MAP = {
		"" : 1,
		'=' : 2,
		'&=' : 3,
		'^=' : 4,
		'$=' : 5,
		'*=' : 6,
		'|=' : 7,
		'!=' : 8,
		'@=' : 9//this is '~='
	}

	/** @type {Object} @const */
	, SELECTOR_COMBINATOR_MAP = {
		"" : 1,
		" " : 1,
		"," : 1,
		">" : 2,
		"~" : 3,
		"+" : 4/*, TODO::CSS4 Reference combinator
		 "/" : 5//CSS4 Reference combinator
		 */
	}

	/** @enum {number} @const */
	, SELECTOR_PSEUDOS_MAP = {
		'nth-child' : 0,
		'nth-last-child' : 1,
		'only-child' : 2,
		'first-child' : 3,
		'last-child' : 4,
		'root' : 5,
		'empty' : 6,
		'contains' : 12,
		'not' : 13,
		'matches' : 14,
		'scope' : 17

		, 'active': 80

		//TODO::
		/*'first-of-type' : 18,
		 'nth-of-type' : 19,
		 'only-of-type' : 20,
		 'nth-last-of-type' : 21,
		 'last-of-type' : 22*/
		/*
		 TODO::   http://css4-selectors.com/selector/css4/
		 'scope' : 17,
		 'dir' ???
		 'nth-match'//nth-match(n of selector) | an E element, the n-th sibling matching selector
		 'nth-last-match'//nth-last-match(n of selector) | an E element, the n-th sibling matching selector, counting from the last one
		 'indeterminate' : 16,
		 'default' : 17,
		 'valid': 18,
		 'invalid' : 19,
		 'in-range' : 20,        //http://www.w3.org/TR/selectors4/#range-pseudos
		 'out-of-range' : 20,    //http://www.w3.org/TR/selectors4/#range-pseudos
		 'required' : 20,        //http://www.w3.org/TR/selectors4/#opt-pseudos
		 'optional' : 20,        //http://www.w3.org/TR/selectors4/#opt-pseudos
		 'column' : 20,          //http://www.w3.org/TR/selectors4/#column-pseudo
		 'nth-column' :20,       //http://www.w3.org/TR/selectors4/#nth-column-pseudo
		 'nth-last-column' : 20, //http://www.w3.org/TR/selectors4/#nth-last-column-pseudo
		 'current' : 20,         //http://www.w3.org/TR/selectors4/#current-pseudo
		 'past' : 20,            //http://www.w3.org/TR/selectors4/#past-pseudo
		 'future' : 20           //http://www.w3.org/TR/selectors4/#future-pseudo
		 */
	}
;

function throwSyntaxErrException(msg) {
	throw new Error(msg || "SYNTAX_ERR")
}

const assert = function(expect, msg) {
	if( expect != true ) {
		throw new Error(msg || "");
	}
};

/**
 * @param {string} selector
 * @return {Array} parsedRule
 * parsedRule[1] - combinator type
 * parsedRule[2] - tag
 * parsedRule[3] - id
 * parsedRule[4] - classes
 * parsedRule[5] - attribute selectors
 * {
 *  1 : <string> // attribute name to check
 *  2 : <number|undefined> // attribute selector operator defined in map SELECTOR_ATTR_OPERATIONS_MAP
 *  3 : <string|undefined> // expected attribute value
 *  4 : <boolean|undefined> // case sensitivity flag
 * }
 * parsedRule[6] - pseudo class
 * parsedRule[7] === "!" - CSS4 parent selector ("!")
 * parsedRule[9] - next rule (for "tag1 tag2" next rule would be parsedRule "tag2")
 */
function parseSelector(selector, options = {}) {
	let rules =	selector
			.trim()
			.replace(/\s*([,>+~\s])\s*/g, "$1")	// double spaces
			.replace(/~=/g, "@=")				// replace '~=` operator to avoid collision with '~' combinator
			.replace(/\-child\((\dn)\+(\d)\)/g, "-child\\($1%$2\\)")
			.match(RE__queryComplexSelector__selectorsMatcher)
		;

	//let {onselector} = options;

	//prepare rules
	let index1 = 0
		, rule = rules[0]
		, parsedRule
		, nextRule
		, prevRule
		, isFirstRule
		, isLastRule
	;

	do {
		//check rule if it start with "," -> next chain of one or more compound selectors
		isFirstRule = index1 === 0 || rule.charAt(0) === ',';

		//parsedRule[1] - combinator type
		//parsedRule[2] - tag
		//parsedRule[3] - id
		//parsedRule[4] - classes
		//parsedRule[5] - attribute selectors
		//parsedRule[6] - pseudo class
		//parsedRule[7] === "!" - CSS4 parent selector ("!")
		//parsedRule[9] - next rule (for "tag1 tag2" next rule would be parsedRule "tag2")
		parsedRule = rules[index1] = rule.match(RE__queryCompoundSelector__selectorMatch);
		if( !isFirstRule ) {
			prevRule[9] = parsedRule;
			rules.splice(index1, 1);
			index1--;
		}

		delete parsedRule.index;
		delete parsedRule.input;

		if ( rule === "," || !parsedRule ) {
			throwSyntaxErrException();
		}

		parsedRule[0] = null;
		parsedRule[1] = SELECTOR_COMBINATOR_MAP[parsedRule[1] || ""];

		nextRule = rules[++index1];
		isLastRule = !nextRule;

		let attributeSelector = parsedRule[5];
		if ( attributeSelector ) {
			parsedRule[5] = parseAttrSelector(attributeSelector);
		}

		let pseudoElement = (parsedRule[6] + "").toLowerCase();
		if( pseudoElement === "root" || pseudoElement === "current" || pseudoElement === "scope" ) {
			//:root is an AST-tree root
			//:current is a currently selected node
			//:scope is not a node, but node-like

			if( isFirstRule ) {//find(':root tag')
				throwSyntaxErrException(`doesn't supported for now`);
				//TODO::
				//parsedRule[0] = [ pseudoElementRules[pseudoElement]() ];
				//parsedRule[2] = null;
			}
			else {//find('tag :root')
				throwSyntaxErrException(`"${pseudoElement}" doesn't supported in a first position`);
			}
		}

		if(parsedRule[7]) {
			throwSyntaxErrException(`doesn't supported for now`);

			//TODO::
			//parsedRule[7] = true;
			////haveStackedResult = true;//CSS4 parent selector ("!")
		}

		prevRule = parsedRule;
	}
	while(rule = nextRule);

	return rules;
}

// TODO:: jsdoc
function parseAttrSelector(selector) {
	let attrChecks;

	//Prepare attribute selectors
	if ( selector ) {
		attrChecks = selector.split("][");

		let iterateIndex = -1
			, current_AttrCheck
			, _tmp2
		;
		//Parse all attribute selector in attribute check object(array) with structure:
		// {
		//  0 : undefined // not using
		//  1 : <string> // attribute name to check
		//  2 : <number|undefined> // attribute selector operator defined in map SELECTOR_ATTR_OPERATIONS_MAP
		//  3 : <string|undefined> // expected attribute value
		//  4 : <boolean|undefined> // case sensitivity flag
		// }
		// and save it to Array `attrChecks`
		while ( current_AttrCheck = attrChecks[++iterateIndex] ) {
			attrChecks[iterateIndex] =
				current_AttrCheck =
					current_AttrCheck.match(/^\[?['"]?(.*?)['"]?(?:([\*~&\^\$@!]?=)['"]?(.*?)['"]?)?\]?$/)
			;

			if ( !current_AttrCheck ) {
				throwSyntaxErrException();
			}

			// delete unnecessary info
			current_AttrCheck[0] =
				current_AttrCheck["input"] =
					current_AttrCheck["index"] =
						null;

			let operator = current_AttrCheck[2];
			if( operator !== void 0 ) {
				// set selector operator
				current_AttrCheck[2] = SELECTOR_ATTR_OPERATIONS_MAP[operator];

				// check if expected attribute value has " i" - case sensitivity flag
				_tmp2 = current_AttrCheck[3];
				if ( _tmp2 ) {
					if ( _tmp2.substr(_tmp2.length - 2) == " i" ) {//Doesn't use string.substr(-2) due old IE doesn't support that
						//http://css4-selectors.com/selector/css4/attribute-case-sensitivity/
						current_AttrCheck[3] = _tmp2.substr(0, _tmp2.length - 2);
						current_AttrCheck[4] = true;
					}
				}
			}
			else {
				current_AttrCheck[2] = SELECTOR_ATTR_OPERATIONS_MAP[""];
			}
		}
		_tmp2 = null;
	}

	return attrChecks;
}

// TODO:: jsdoc
function parsePseudoClass(selector) {
	if ( !selector ) {
		return void 0;
	}

	let rules = selector.split(":");

	//Parse all attribute selector in attribute check object(array) with structure:
	// {
	//  0 : undefined // not using
	//  1 : <number> // pseudo type defined in map SELECTOR_PSEUDOS_MAP
	//  2 : <Array.<[undefined, number, string, number]>|undefined> // [For Tree-Structural pseudo-class] parsed Tree-Structural pseudo-class rule, for example in :nth-child(an+b) "an+b" - is a rule. Structure for rule:
	//   {
	//     0 : undefined // not using
	//     1 : <number> // "a" from "an+b"
	//     2 : <string> // operator "an+b", in this case it is "+"
	//     3 : <number> // "b" from "an+b"
	//   }
	//  3 : <string|undefined> // [For Tree-Structural pseudo-class] property for saving caching result of rule (for example "an+b") to Node "nodeIndexLast" or "nodeIndex"
	//  4 : <string|undefined> // [For Tree-Structural pseudo-class] Node child property name: "lastChild" or "firstChild"
	//  5 : <string|undefined> // [For Tree-Structural pseudo-class] Node sibling property name: "previousSibling" or "nextSibling"
	// }
	let iterateIndex = -1, rule;
	while ( rule = rules[++iterateIndex] ) {
		rules[iterateIndex] = rule = rule.match(/^([^(]+)(?:\((.+)\))?$/);

		if ( !rule ) {
			throwSyntaxErrException();
		}

		// delete unnecessary info
		rule[0] = rule["input"] = rule["index"] = void 0;

		// save pseudo type into a temporary variable
		let preudoType = rule[1] = SELECTOR_PSEUDOS_MAP[rule[1]];

		// Check if this is a Tree-Structural pseudo-class 'nth-child' (preudoType == 0) or 'nth-last-child' (preudoType == 1)
		if ( preudoType < 2 && rule[2] ) {
			if ( !/\D/.test(rule[2]) ) { // number value like nth-child(2n+1)
				rule[2] = [null, 0, '%', rule[2]];
			}
			else if(rule[2] === 'even') {
				rule[2] = [null, 2];
			}
			else if(rule[2] === 'odd') {
				rule[2] = [null, 2, '%', 1];
			}
			else {
				rule[2] = rule[2].match(/(?:([-]?\d*)n)?(?:(%|-)(\d*))?/);
				rule[2][0] = null;// delete unnecessary string
				if ( !rule[2][3] ) {//delete noop nth-child(n)
					rules.splice(iterateIndex, 1);
					--iterateIndex;
				}
			}

			rule[3] = preudoType ? "nodeIndexLast" : "nodeIndex";
			rule[4] = preudoType ? "lastChild" : "firstChild";
			rule[5] = preudoType ? "previousSibling" : "nextSibling";
		}
// TODO
//		else if(preudoType === 17) {//:scope pseudo class
//			if(!scope_isFirstRule) {
//				throwSyntaxErrException();
//			}
//			isMatchesSelector = true;
//			preResult = root_is_iterable_object ? roots : [roots];
//			rules.splice(iterateIndex, 1);
//			--iterateIndex;
//		}
		else if( preudoType == 12 ) {//:contains pseudo class
			let pattern = rule[2];

			if ( pattern ) {
				if ( /['"]/.test(pattern.charAt(0)) && /['"]/.test(pattern.charAt(pattern.length - 1)) ) {
					rule[2] = pattern.substr(1, pattern.length - 2);
				}
			}
		}
		/*TODO:
		 else if(preudoType === 18) {//:focus pseudo class
		 isMatchesSelector = true;
		 preResult = [document.activeElement];
		 }*/
	}

	if ( rules.length ) {
		return rules;
	}
	return void 0;
}

module.exports = {
	parseSelector
	, parseAttrSelector
	, parsePseudoClass
};
