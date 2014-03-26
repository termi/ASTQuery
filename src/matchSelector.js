"use strict";

const {parseAttrSelector} = require('./parseSelector.js');

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
	matchAttributes
};
