#!/bin/bash

for FILE in $(ls ./input)
do
    npx @svgr/cli -- ./input/${FILE%.*}.svg > ./output/${FILE%.*}.tsx
done