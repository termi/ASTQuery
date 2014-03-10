#!/bin/sh
cd ..

rm -rf build/npm
mkdir build/npm

git archive master -o build/npm/ast-query.tar --prefix=ast-query/

cd build/npm

tar xf ast-query.tar && rm ast-query.tar

cd ast-query
rm .gitignore

cd build
./build.sh

cd ../..
tar czf ast-query.tgz ast-query && rm -rf ast-query
