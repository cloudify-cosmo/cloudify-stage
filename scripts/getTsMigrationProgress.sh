#!/usr/bin/env bash
# Prints the summary of the migration to TypeScript

set -euo pipefail

DIRECTORIES_TO_CHECK="app widgets test backend"
echo "Inspecting files in directories: $DIRECTORIES_TO_CHECK"

cd ..
JS_FILES_COUNT=`find $DIRECTORIES_TO_CHECK -type f \( -name '*.js' -o -name '*.jsx' \) ! -path '*node_modules*' ! -name 'babel.config.js' | wc -l`
echo "Found $JS_FILES_COUNT JS/JSX files"

TS_FILES=`find $DIRECTORIES_TO_CHECK -type f \( -name '*.ts' -o -name '*.tsx' \) ! -path '*node_modules*'`
TS_FILES_COUNT=`echo "$TS_FILES" | wc -l`
echo "Found $TS_FILES_COUNT TS/TSX files"
TS_NOCHECK_COUNT=`grep '@ts-nocheck' $TS_FILES | wc -l`
echo "$TS_NOCHECK_COUNT out of these TS/TSX files have a '@ts-nocheck' header"

TOTAL_FILES_COUNT=$(($JS_FILES_COUNT+$TS_FILES_COUNT))

function print_summary {
    local name=$1
    local files_count=$2
    echo "$name: $files_count / $TOTAL_FILES_COUNT (`bc <<< "scale=2; $files_count * 100 / $TOTAL_FILES_COUNT"`%)"
}

TS_FULLY_MIGRATED_COUNT=$(($TS_FILES_COUNT - $TS_NOCHECK_COUNT))
printf "\nSummary:\n"
print_summary "JS/JSX" $JS_FILES_COUNT
print_summary "TS/TSX" $TS_FILES_COUNT
print_summary "Fully migrated TS/TSX" $TS_FULLY_MIGRATED_COUNT
