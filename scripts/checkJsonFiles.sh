#!/usr/bin/env bash

ajv help > /dev/null || npm install -g ajv-cli
ajv -s templates/schemas/template.schema.json -d "templates/*.json" && \
ajv -s templates/schemas/page-group.schema.json -d "templates/page-groups/*.json" && \
ajv -s templates/schemas/page.schema.json -d "templates/pages/*.json"
