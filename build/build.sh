#!/bin/sh

./clean.sh

mkdir es5
mkdir npm
mkdir test

node --harmony build.js

./test.sh
