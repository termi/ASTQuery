"use strict";

const es6transpiler = require('es6-transpiler')
	, path = require('path')
	, fs = require('fs')
	, BUILD_VERSION = require('../package.json').version
;

console.log("beginning ast-alter build");

function prepareFile(dir, targetDir) {
	let results = [];

	if ( !path.existsSync(path.join(targetDir, dir)) ) {
		fs.mkdirSync(path.join(targetDir, dir));
	}

	let list = fs.readdirSync(dir);

	list.forEach(function(file) {
		file = path.join(dir, file);

		let stat = fs.statSync(file);

//		console.log(file, stat.isDirectory(), path.join(targetDir, dir) )
		if ( stat && stat.isDirectory() ) {
			results = results.concat(prepareFile(file, targetDir));
		}
		else if ( path.extname(file) === '.js' ) {
			results.push(file);
		}
	});

	return results;
}

let moduleFiles = ['ASTQuery'];
let testFiles = prepareFile(path.join('..', 'test'), 'build');

//console.log(testFiles);process.exit(0)

moduleFiles.concat(testFiles).forEach(function(filename) {
	filename = filename.replace(/\//g, path.sep);
	if ( path.extname(filename) !== '.js' ) {
		filename += '.js';
	}

	let outputFilename = path.join('es5', filename);

	filename = path.join('..', 'src', filename);

	console.log('compile ' + filename + ' to ' + outputFilename);

	let fileContent = String(fs.readFileSync(filename)).replace("%%BUILD_VERSION%%", BUILD_VERSION);

	let res = es6transpiler.run({src: fileContent});

	if ( res.errors && res.errors.length ) {
		console.error.apply(console.error, ['ERRORS:: \n   '].concat(res.errors, ['\n']));
		return;
	}

	fileContent = res.src;
	fs.writeFileSync(outputFilename, fileContent);
});

console.log("done build")
