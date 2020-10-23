#!/usr/bin/env bash

if [ -n "${CIRCLE_BRANCH}" ]; then
  STAGE_BRANCH=${CIRCLE_BRANCH}
  CURL_OPTIONS="-u ${GITHUB_USERNAME}:${GITHUB_TOKEN}"
else
  STAGE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  CURL_OPTIONS=
fi

DOCS_BRANCH="master"
if [[ $STAGE_BRANCH =~ [0-9].[0-9]{1,2}-build ]]; then
  DOCS_BRANCH=STAGE_BRANCH
fi

COMPONENTS_REPOSITORY="cloudify-ui-components"
STAGE_REPOSITORY="cloudify-stage"
DOCS_REPOSITORY="docs.getcloudify.org"
WIDGETS_COMPONENTS_PATH="content/developer/writing_widgets/widgets-components.md"
WIDGET_COMPONENTS_URL="https://raw.githubusercontent.com/cloudify-cosmo/${DOCS_REPOSITORY}/${DOCS_BRANCH}/${WIDGETS_COMPONENTS_PATH}"

VERSION_IN_DOCS=$(curl -s "$CURL_OPTIONS" "$WIDGET_COMPONENTS_URL" | grep ui_components_link: | sed 's/.*ui-components\/\(.*\)"/\1/')
VERSION_IN_STAGE=$(npm --json list ${COMPONENTS_REPOSITORY} | jq --raw-output ".dependencies.\"${COMPONENTS_REPOSITORY}\".version")

echo "Checking version of ${COMPONENTS_REPOSITORY} package in official Cloudify documentation ..."
if [ "$VERSION_IN_DOCS" == "$VERSION_IN_STAGE" ]; then
  echo "Version of ${COMPONENTS_REPOSITORY} is in sync with ${STAGE_REPOSITORY}."
else
  echo "Version of ${COMPONENTS_REPOSITORY} is not in sync with ${STAGE_REPOSITORY}."
  echo "- ${COMPONENTS_REPOSITORY} in ${STAGE_REPOSITORY}: '${VERSION_IN_STAGE}'"
  echo "- ${COMPONENTS_REPOSITORY} in ${DOCS_REPOSITORY}: '${VERSION_IN_DOCS}'"
  echo "Please update ${WIDGETS_COMPONENTS_PATH} file in ${DOCS_REPOSITORY} repository on ${DOCS_BRANCH} branch."
  exit 1
fi
