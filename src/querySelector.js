

const
	/** @type {RegExp} @const */
	RE__queryComplexSelector__selectorsMatcher = /(^|,|>|\+|~|\s).+?(?=[,>+~\s]|$)/g
	/*TODO::CSS4 Reference combinator
	 , RE__queryComplexSelector__selectorsMatcher = /(^|,|\>|\+|~|\/| ).+?(?=[,>+~/ ]|$)/g

	 */
	/** @type {RegExp} @const */
	, RE__queryCompoundSelector__selectorMatch = /^([,>+~\s])?([\w\-\|\*]*)#?([\w-]*)((?:\.?[\w-])*)(\[.+\])?(?::([^!]+))?(!)?$////^([,>+~ ])?(\$)?([\w\-\|\*]*)\#?([\w-]*)((?:\.?[\w-])*)(\[.+\])?(?:\:(.+))?$/
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
function parseSelector(selector) {
	let rules =	selector
			.trim()
			.replace(/\s*([,>+~\s])\s*/g, "$1")	// double spaces
			.replace(/~=/g, "@=")				// replace '~=` operator to avoid collision with '~' combinator
			.replace(/\-child\((\dn)\+(\d)\)/g, "-child\\($1%$2\\)")
			.match(RE__queryComplexSelector__selectorsMatcher)
		;

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

		if(rule === "," || !parsedRule) {
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

function matchAttributes(node, attributes) {
	if( typeof attributes === 'string' ) {
		attributes = parseAttrSelector(attributes);
	}

	let match = true;

	for( let attrRule of attributes ) {
		// Save attribute check operator in a temporary variable
		let operator = attrRule[2];
		//attr[1] is an attribute name
		let attrValue = node[attrRule[1]] + "";

		// Quick check if we have no attribute value and attribute check operator is not '!=' (8)
		if(attrValue === null) {
			match = operator === 8;
			continue;
		}
		attrValue = attrValue + "";

		// CSS4 Attribute case-sensitivity
		if ( attrRule[4] ) {
			attrValue = attrValue.toUpperCase();
		}

		// Expected attribute value
		let attrExpectedValue = attrRule[3];

		switch(operator) {// operator - attribute check operator defined in map SELECTOR_ATTR_OPERATIONS_MAP

			case 1://css3Attr[2] == '' // W3C "an E element with a "attrValue" attribute"
				match = !!attrValue || attrValue === "";
				break;

			case 2://'=' // W3C "an E element whose "attrValue" attribute attrExpectedValue is exactly equal to "attrExpectedValue"
				match = attrValue === attrExpectedValue;
				break;

			case 3://'&=' // from w3.prg "an E element whose "attrValue" attribute attrExpectedValue is a list of space-separated attrExpectedValue's, one of which is exactly equal to "attrExpectedValue"
			case 8://'!=' // attrValue doesn't contain given attrExpectedValue
				match = (new RegExp(`(^| +)${attrExpectedValue}($| +)`).test(attrValue));
				if(operator === 8)match = !match;
				break;

			case 4://'^=' // from w3.prg "an E element whose "attrValue" attribute attrExpectedValue begins exactly with the string "attrExpectedValue"
			case 5://'$=' // W3C "an E element whose "attrValue" attribute attrExpectedValue ends exactly with the string "attrExpectedValue"
			case 6://'*=' // W3C "an E element whose "attrValue" attribute attrExpectedValue contains the substring "attrExpectedValue"
				let containsIndex = attrValue.indexOf(attrExpectedValue);
				match = operator === 6 ? !!~containsIndex : operator === 5 ? (containsIndex == attrValue.length - attrExpectedValue.length) : !containsIndex;
				break;

			case 7://'|=' // W3C "an E element whose "attrValue" attribute has a hyphen-separated list of attrExpectedValue's beginning (from the left) with "attrExpectedValue"
				match = ((attrValue === attrExpectedValue || !!~attrValue.indexOf(attrExpectedValue + '-')));
				break;

			case 9://'~='
				match = !!~(` ${attrValue.replace(/\s/g, " ")} `).indexOf(` ${attrExpectedValue} `);
				break;
		}

		if( !match )break;
	}

	return match;
}

module.exports = {
	parseSelector
	, parseAttrSelector
	, matchAttributes
};
