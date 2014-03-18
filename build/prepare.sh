#!/bin/sh
cd ..

rm -rf build/npm
mkdir build/npm

git archive master -o build/npm/astquery.tar --prefix=astquery/

cd build/npm

tar xf astquery.tar && rm astquery.tar

cd astquery
rm .gitignore

cd build
./build.sh

rm -rf ./npm
rm -rf ./test
rm build.js
rm build.sh
rm clean.sh
rm prepare.sh
rm test.sh

cd ..
rm -rf ./src
rm -rf ./test

cd ..
tar czf astquery.tgz astquery && rm -rf astquery
