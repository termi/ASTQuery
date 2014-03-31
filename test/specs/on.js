
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

		es6AstQuery.reset();
		es6AstQuery.on({
			Literal({type}) {
				test.equals(type, 'Literal', `should found only node's with type "Literal"`);
				nodesCount++;
			}
		});
		es6AstQuery.apply();

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	, 'Name selector "#a"': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		es6AstQuery.reset();
		es6AstQuery.on({
			'#a': function({name}) {
				test.equals(name, 'a', `should found only node's with name='a'`);
				nodesCount++;
			}
		});
		es6AstQuery.apply();

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	, 'Attribute selector "[shorthand=true]"': function (test) {
		const nodesCountExpected = 2;
		let nodesCount = 0;

		es6AstQuery.reset();
		es6AstQuery.on({
			'[shorthand=true]': function({shorthand}) {
				test.equals(shorthand, true, `should found only node's with shorthand=true`);
				nodesCount++;
			}
		});
		es6AstQuery.apply();

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
	
	, 'dot,escapeChar[value=S]': function(test) {
		const nodesCountExpected = 2;
		let nodesCount = 0;

		regExpAstQuery.reset();
		regExpAstQuery.on({
			'dot,escapeChar[value=S]': function({type}) {
				test.ok(type == 'dot' || type == 'escapeChar', `type should be 'dot' or 'escapeChar'`);
				nodesCount++;
			}
		});
		regExpAstQuery.apply();

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}

	, '"post" callback test': function(test) {
		const nodesSequenceExpected = "|disjunction|alternative|alternative|escapeChar|^group|alternative|alternative|^group|^disjunction";
		let nodesSequence = "";

		let pre = ({type}) => (nodesSequence = nodesSequence + "|" + type);
		let post = ({type}) => (nodesSequence = nodesSequence + "|^" + type);

		regExpAstQuery.reset();
		regExpAstQuery.on({
			'disjunction': pre
			, 'alternative': pre
			, '^group': post
			, 'escapeChar': pre
			, '^disjunction': post
		});
		regExpAstQuery.apply();

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

		regExpAstQuery.reset();
		regExpAstQuery.on(obj, {prefix: '::'});
		regExpAstQuery.apply();

		test.equals(obj['dot'], 'dot');
		test.equals(obj['escapeChar'], 'escapeChar');
		test.done();
	}

	, 'mod\'ed selectors': function(test) {
		const outerNodesSequenceExpected = "|alternative|alternative";
		const innerNodesSequenceExpected = "|alternative-inner|alternative-inner|alternative-inner|alternative-inner";
		const nodesSequenceExpected = "|group|escapeChar|group";
		let outerNodesSequence = "", innerNodesSequence = "", nodesSequence = "";
		let sourceIndex = 0;
		const expectedSourceIndexes = ["alternative|2", "alternative|2", "group|3", "alternative|4", "escapeChar|5", "alternative|6", "alternative|6", "group|7", "alternative|8"];
		let sourceIndexes = [];

		const obj = {
			'? *': function(node) {
				node.__sourceIndex = ++sourceIndex;
			}
			, 'alternative': function(node, astQuery) {
				outerNodesSequence += `|${node.type}`;
				astQuery.mods.toggle('inner');

				sourceIndexes.push(`${node.type}|${node.__sourceIndex}`);// 2, 6
			}
			, '?inner alternative': function(node) {
				innerNodesSequence += `|${node.type}-inner`;

				sourceIndexes.push(`${node.type}|${node.__sourceIndex}`);// 2, 4, 6, 8
			}
			, '? group': function(node) {//& - empty mod evaluated as '*'
				nodesSequence += `|${node.type}`;

				sourceIndexes.push(`${node.type}|${node.__sourceIndex}`);// 3, 7
			}
			, '?*?any escapeChar': function(node) {//&* - has universal '*' mod
				nodesSequence += `|${node.type}`;

				sourceIndexes.push(`${node.type}|${node.__sourceIndex}`);// 5
			}
			, '^ ?inner alternative': function(node, astQuery) {
				astQuery.mods.toggle('inner');
			}
		};

		regExpAstQuery.reset();
		regExpAstQuery.on(obj);
		regExpAstQuery.apply();

		test.equals(outerNodesSequence, outerNodesSequenceExpected);
		test.equals(innerNodesSequence, innerNodesSequenceExpected);
		test.equals(nodesSequence, nodesSequenceExpected);
		test.deepEqual(sourceIndexes, expectedSourceIndexes);
		test.equals(regExpAstQuery.mods.length, 0);
		test.done();
	}

//	, 'post (^) callback': function(test) {
//		// TODO::
//	}

	, 'matches queue': function(test) {
		const expectedMatchesQueue = [1, 2, 3, 4];
		let matchesQueue = [];

		const obj1 = {
			':: *': function() {
				if ( matchesQueue.indexOf(1) === -1 ) {
					matchesQueue.push(1);
				}
			}
			, ':: ^ *': function() {
				if ( matchesQueue.indexOf(2) === -1 ) {
					matchesQueue.push(2);
				}
			}
		};
		const obj2 = {
			':: *': function() {
				if ( matchesQueue.indexOf(3) === -1 ) {
					matchesQueue.push(3);
				}
			}
			, ':: ^ *': function() {
				if ( matchesQueue.indexOf(4) === -1 ) {
					matchesQueue.push(4);
				}
			}
		};

		regExpAstQuery.reset();
		regExpAstQuery.on(obj1, {prefix: '::'});
		regExpAstQuery.on(obj2, {prefix: '::'});
		regExpAstQuery.apply();

		test.deepEqual(matchesQueue, expectedMatchesQueue);
		test.done();
	}
};
