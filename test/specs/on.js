
const utils = require('../utils')
	, ASTQuery = utils.getES5Module('ASTQuery')
	, astTree = getAstTree()
	, astQuery = new ASTQuery(astTree)
;

exports['simple'] = {
	'Type selector "Literal"': function (test) {
		const nodesCountExpected = 3;
		let nodesCount = 0;

		astQuery.on({
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

		astQuery.on({
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

		astQuery.on({
			'[shorthand=true]': function({shorthand}) {
				test.equals(shorthand, true, `should found only node's with shorthand=true`);
				nodesCount++;
			}
		});

		test.equals(nodesCount, nodesCountExpected, `should found ${nodesCountExpected} node's`);
		test.done();
	}
};

// TODO:: ```javascript
//	var answer = 6 * 7;
//	var a = 1, obj = {a};
//	var arrowFunc = (def = 777) => (def + 1);
//  ```
function getAstTree() {
//```javascript
//function test() { let a = 1; { let a = 2; } return a; }
//let b = {test}, c = {b}, d = {notShorthand: 999};
//```
	return {
		"type": "Program",
		"body": [
			{
				"type": "FunctionDeclaration",
				"id": {
					"type": "Identifier",
					"name": "test"
				},
				"params": [],
				"defaults": [],
				"body": {
					"type": "BlockStatement",
					"body": [
						{
							"type": "VariableDeclaration",
							"declarations": [
								{
									"type": "VariableDeclarator",
									"id": {
										"type": "Identifier",
										"name": "a"
									},
									"init": {
										"type": "Literal",
										"value": 1,
										"raw": "1"
									}
								}
							],
							"kind": "let"
						},
						{
							"type": "BlockStatement",
							"body": [
								{
									"type": "VariableDeclaration",
									"declarations": [
										{
											"type": "VariableDeclarator",
											"id": {
												"type": "Identifier",
												"name": "a"
											},
											"init": {
												"type": "Literal",
												"value": 2,
												"raw": "2"
											}
										}
									],
									"kind": "let"
								}
							]
						},
						{
							"type": "ReturnStatement",
							"argument": {
								"type": "Identifier",
								"name": "a"
							}
						}
					]
				},
				"rest": null,
				"generator": false,
				"expression": false
			},
			{
				"type": "VariableDeclaration",
				"declarations": [
					{
						"type": "VariableDeclarator",
						"id": {
							"type": "Identifier",
							"name": "b"
						},
						"init": {
							"type": "ObjectExpression",
							"properties": [
								{
									"type": "Property",
									"key": {
										"type": "Identifier",
										"name": "test"
									},
									"value": {
										"type": "Identifier",
										"name": "test"
									},
									"kind": "init",
									"method": false,
									"shorthand": true
								}
							]
						}
					},
					{
						"type": "VariableDeclarator",
						"id": {
							"type": "Identifier",
							"name": "c"
						},
						"init": {
							"type": "ObjectExpression",
							"properties": [
								{
									"type": "Property",
									"key": {
										"type": "Identifier",
										"name": "b"
									},
									"value": {
										"type": "Identifier",
										"name": "b"
									},
									"kind": "init",
									"method": false,
									"shorthand": true
								}
							]
						}
					},
					{
						"type": "VariableDeclarator",
						"id": {
							"type": "Identifier",
							"name": "d"
						},
						"init": {
							"type": "ObjectExpression",
							"properties": [
								{
									"type": "Property",
									"key": {
										"type": "Identifier",
										"name": "notShorthand"
									},
									"value": {
										"type": "Literal",
										"value": 999,
										"raw": "999"
									},
									"kind": "init",
									"method": false,
									"shorthand": false
								}
							]
						}
					}
				],
				"kind": "let"
			}
		]
	}}
