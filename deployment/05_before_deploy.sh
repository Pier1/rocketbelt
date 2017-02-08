#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

# If we're on master, build for gh-pages & push to that branch
if [ $TRAVIS_PULL_REQUEST = "false" ] && [ $TRAVIS_BRANCH = $SOURCE_BRANCH ]; then
  mv dist/* .
  rmdir dist

  git add . --all
  git commit -m "Build for gh-pages: ${SHA}"

  git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
  git merge -s recursive -X theirs TEMP_BRANCH -m "Merge into gh-pages: ${SHA}" || true
  git status --porcelain | awk '{if ($1=="DU") print $2}' | xargs git rm
  git add .
  git commit -m "Merge into gh-pages: ${SHA}"

  ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
  ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
  ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
  ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
  openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy_key.enc -out deploy_key -d
  chmod 600 deploy_key
  eval `ssh-agent -s`
  ssh-add deploy_key

  git push $SSH_REPO $TARGET_BRANCH
  git branch -D TEMP_BRANCH
fi
