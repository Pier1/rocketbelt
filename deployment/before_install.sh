#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

cd $HOME
rm -rf gh-pages/**/* || exit 0
git clone $REPO gh-pages
cd gh-pages

SHA=`git rev-parse --verify HEAD`
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

git checkout -b TEMP_BRANCH
