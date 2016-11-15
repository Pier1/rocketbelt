#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

if [ $TRAVIS_PULL_REQUEST  = "false" ]; then
  openssl aes-256-cbc -K $encrypted_d1e5f63af608_key -iv $encrypted_d1e5f63af608_iv -in deploy_key.enc -out deploy_key -d
fi

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

cd $HOME
rm -rf gh-pages/**/* || exit 0
git clone $REPO gh-pages
cd gh-pages

SHA=`git rev-parse --verify HEAD`

git checkout -b TEMP_BRANCH
