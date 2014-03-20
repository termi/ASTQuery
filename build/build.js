"use strict";

const es6transpiler = require('es6-transpiler')
	, path = require('path')
	, fs = require('fs')
	, BUILD_VERSION = require('../package.json').version
	, targetDir = path.join(__dirname, 'es5')
	, srcDir = path.join(__dirname, '..', 'src')
	, projectDit = path.join(__dirname, '..')
;

function prepareFile(files, fileOrDir, fullPath) {
	let extname = path.extname(fileOrDir);
	let fileName = fullPath === true ? fileOrDir : path.join(srcDir, fileOrDir);
	let outputFileName = fullPath === true ? path.join(targetDir, path.relative(srcDir, fileOrDir)) : path.join(targetDir, fileOrDir);
	let isFile = false;

	if ( fs.existsSync(extname ? fileName : fileName + ".js") ) {
		fileName = extname ? fileName : fileName + ".js";
		outputFileName = extname ? outputFileName : outputFileName + ".js";
		isFile = true;
		extname = path.extname(fileName);
	}

	if ( isFile ) {
		if ( extname === '.js' ) {
			files.push({src: fileName, dest: outputFileName});
		}
	}
	else if ( fs.existsSync(fileName) ) {
		if ( !fs.existsSync(outputFileName) ) {
//		    console.log('make a', outputFileName)
		    fs.mkdirSync(outputFileName);
		}

		let stat = fs.statSync(fileName);
		if ( stat && stat.isDirectory() ) {
			fs.readdirSync(fileName).forEach(function(file) {
				prepareFile(files, path.join(fileName, file), true);
			});
		}
	}

	return files;
}

[
	'ASTQuery'
	, 'querySelector'
	, 'keys'
	, path.join('..', 'test')
].reduce(prepareFile, []).forEach(function(file) {
	let srcFilename = file.src;
	let outputFilename = file.dest;

	console.log('compile ' + path.relative(projectDit, srcFilename) + ' to ' + path.relative(projectDit, outputFilename));

	let fileContent = String(fs.readFileSync(srcFilename)).replace("%%BUILD_VERSION%%", BUILD_VERSION);

	let res = es6transpiler.run({src: fileContent});

	if ( res.errors && res.errors.length ) {
		console.error.apply(console.error, ['ERRORS in file "' + path.relative(projectDit, srcFilename) + '":: \n   '].concat(res.errors, ['\n']));
		return;
	}

	fileContent = res.src;
	fs.writeFileSync(outputFilename, fileContent);
});

console.log("done build");
