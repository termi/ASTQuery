#!/bin/sh

./clean.sh

echo "beginning astalter build"

mkdir es5
mkdir npm
mkdir test

node --harmony build.js

./test.sh
