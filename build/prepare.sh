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

cd ../..
tar czf astquery.tgz astquery && rm -rf astquery
