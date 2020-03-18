#!/usr/local/bin/bash

files=()

while IFS= read -r -d $'\0'; do
 files+=("$REPLY")
done < <(find ./dist -name 'rocketbelt*js' ! -name '*slipsum*' ! -name '*.min.js' -print0)

length=${#files[@]}
i=0

for file in "${files[@]}"
do
   i=$((i+1))
   min=$(echo $file | sed 's/.js/.min.js/g')
   echo "($i/$length) $min"
   npx babel $file --presets=@babel/preset-env --source-maps=inline | \
     npx uglifyjs -c -m --source-map 'content=inline' -o $min
done
