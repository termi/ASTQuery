
const utils = require('../utils')
	, ASTQuery = utils.getES5Module('ASTQuery')
//	, es6AstTree = utils.getAstTree('es6', 0)
//	, es6AstQuery = new ASTQuery(es6AstTree, 'es6')
	, regExpAstTree = utils.getAstTree('regexp', 0)
	, regExpAstQuery = new ASTQuery(regExpAstTree, 'regexp')
;

exports['pre'] = {
	'all nodes': function (test) {
		const nodesCountExpected = 9;
		let nodesCount = 0;

		regExpAstQuery.traverse(function() {
			nodesCount++;
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
	, 'return false': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		regExpAstQuery.traverse(function({type}) {
			nodesCount++;
			if ( type == 'alternative' ) {
				return false;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
};

exports['post'] = {
	'should works without pre': function (test) {
		const nodesCountExpected = 9;
		let nodesCount = 0;

		regExpAstQuery.traverse(void 0, function() {
			nodesCount++;
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
};

exports['traverse through specific node - pre'] = {
	'all nodes': function (test) {
		const nodesCountExpected = 9;
		let nodesCount = 0;

		regExpAstQuery.traverse(regExpAstTree, function() {
			nodesCount++;
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
	, 'return false': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		regExpAstQuery.traverse(regExpAstTree, function({type}) {
			nodesCount++;
			if ( type == 'alternative' ) {
				return false;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
};

exports['traverse through specific node - post'] = {
	'should works without pre': function (test) {
		const nodesCountExpected = 9;
		let nodesCount = 0;

		regExpAstQuery.traverse(regExpAstTree, void 0, function() {
			nodesCount++;
		});

		test.equals(nodesCount, nodesCountExpected, `should traverse through ${nodesCountExpected} node's`);
		test.done();
	}
};
