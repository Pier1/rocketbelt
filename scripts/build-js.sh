#!/usr/local/bin/bash

files=()

while IFS= read -r -d $'\0'; do
 files+=("$REPLY")
done < <(find ./dist -name 'rocketbelt*js' ! -name '*slipsum*' ! -name '*.min.js' -print0)

for file in "${files[@]}"
do
   min=$(echo $file | sed 's/.js/.min.js/g')
   npx babel $file --presets=@babel/preset-env --source-maps=inline | uglifyjs -c -m --source-map 'content=inline' -o $min
done
