#!/bin/sh

clean.sh

echo "beginning ast-alter build"

mkdir es5
mkdir npm
mkdir test

node --harmony build.js

echo "running tests (in es5 mode i.e. without --harmony)"

test.sh
