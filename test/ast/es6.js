module.exports = [
//```javascript
//function test() { let a = 1; { let a = 2; } return a; }
//let b = {test}, c = {b}, d = {notShorthand: 999};
//```
	{
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
	}
// TODO:: ```javascript
//	var answer = 6 * 7;
//	var a = 1, obj = {a};
//	var arrowFunc = (def = 777) => (def + 1);
//  ```

];
