#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

function ghpBuild {
  cd $HOME
  rm -rf gh-pages/**/* || exit 0
  git clone $REPO gh-pages
  cd gh-pages
  SHA=`git rev-parse --verify HEAD`

  git checkout -b TEMP_BRANCH
  npm install

  echo -e "#-- TEMP CHANGES TO GITIGNORE FOR DEPLOYMENT --\nREADME.md\ndeploy*\ngulpfile.js\npackage.json\nrocketbelt/**/*\ntemplates/**/*\n\n$(cat .gitignore)" > .gitignore

  gulp build
  mv dist/* .
  rmdir dist

  git add . --all
  git commit -m "Build for gh-pages: ${SHA}"
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    # ghpBuild
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

ghpBuild

git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
git merge -s recursive -X theirs TEMP_BRANCH -m "Merge into gh-pages: ${SHA}"
git status --porcelain | awk '{if ($1=="DU") print $2}' | xargs git rm
git commit -m "Merge into gh-pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key
# cp deploy_key ~/.ssh/id_rsa

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH
git branch -D TEMP_BRANCH
