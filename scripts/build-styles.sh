#!/usr/local/bin/bash

find ./dist -name 'rocketbelt*scss' -print0 | xargs -0 -I{} npx node-sass {} -o ./dist/css --source-map true
npx postcss ./dist/css/*.css --dir ./dist/css --map --ext .min.css
