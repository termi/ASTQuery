# ASTQuery

Use css-like selectors for walking over AST-tree

## Example

```javascript
var ast = esprima.parse('function test(){ var a, b = 0; a = 1; a += 2; b++; b--; };test();');
var astQuery = new ASTQuery(ast, 'es5');
astQuery.on({
	print: function(node, message) {
		console.log('node type is ' + node.type + ' | ' + message)
	}

	, ':: FunctionDeclaration': function(node) {
		this.print(node, '1| ');
	}

	, ':: VariableDeclarator': function(node) {
		this.print(node, '2| ' + node.id.name);
	}

	, ':: AssignmentExpression[operator="="]': function(node) {
		this.print(node, '3| ' + node.left.name + "|" + node.operator);
	}

// TODO::
//	, ':: UpdateExpression[operator="++"]': function(node) {
//		this.print(node, '4| ' + node.argument.name + "|" + node.operator);
//	}
}, {prefix: '::'});

// console output is:
// > node type is FunctionDeclaration | 1|
// > node type is VariableDeclarator | 2| a
// > node type is VariableDeclarator | 2| b
// > node type is AssignmentExpression | 3| a|=

```
