#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

echo -e "#-- TEMP CHANGES TO GITIGNORE FOR DEPLOYMENT --\nREADME.md\ndeploy*\ngulpfile.js\npackage.json\nrocketbelt/**/*\ntemplates/**/*\n\n$(cat .gitignore)" > .gitignore
gulp build
