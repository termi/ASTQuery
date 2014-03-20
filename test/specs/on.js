
const utils = require('../utils')
	, ASTQuery = utils.getES5Module('ASTQuery')
	, es6AstTree = utils.getAstTree('es6', 0)
	, es6AstQuery = new ASTQuery(es6AstTree, 'es6')
	, regExpAstTree = utils.getAstTree('regexp', 0)
	, regExpAstQuery = new ASTQuery(regExpAstTree, 'regexp')
;

exports['simple'] = {
	'Type selector "Literal"': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		es6AstQuery.on({
			Literal({type}) {
				test.equals(type, 'Literal', `should found only node's with type "Literal"`);
				nodesCount++;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	, 'Name selector "#a"': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		es6AstQuery.on({
			'#a': function({name}) {
				test.equals(name, 'a', `should found only node's with name='a'`);
				nodesCount++;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	, 'Attribute selector "[shorthand=true]"': function (test) {
		const nodesCountExpected = 2;
		let nodesCount = 0;

		es6AstQuery.on({
			'[shorthand=true]': function({shorthand}) {
				test.equals(shorthand, true, `should found only node's with shorthand=true`);
				nodesCount++;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	
	, 'dot,escapeChar[value=S]': function(test) {
		const nodesCountExpected = 2;
		let nodesCount = 0;

		regExpAstQuery.on({
			'dot,escapeChar[value=S]': function({type}) {
				test.ok(type == 'dot' || type == 'escapeChar', `type should be 'dot' or 'escapeChar'`);
				nodesCount++;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}

	, '"post" callback test': function(test) {
		const nodesSequenceExpected = "|disjunction|alternative|alternative|escapeChar|^group|alternative|alternative|^group|^disjunction";
		let nodesSequence = "";

		let pre = ({type}) => (nodesSequence = nodesSequence + "|" + type);
		let post = ({type}) => (nodesSequence = nodesSequence + "|^" + type);

		regExpAstQuery.on({
			'disjunction': pre
			, 'alternative': pre
			, '^group': post
			, 'escapeChar': pre
			, '^disjunction': post
		});

		test.equals(nodesSequence, nodesSequenceExpected, `the node sequence should be ${nodesSequenceExpected}`);
		test.done();
	}

	, 'prefixed selectors': function(test) {
		const obj = {
			'::dot': function({type}) {
				this.setType(type);
			}
			, ':: ^ escapeChar': function({type}) {
				this.setType(type);
			}
			, setType(type) {
				this[type] = type;
			}
		};

		regExpAstQuery.on(obj, {prefix: '::'});

		test.equals(obj['dot'], 'dot');
		test.equals(obj['escapeChar'], 'escapeChar');
		test.done();
	}
};
