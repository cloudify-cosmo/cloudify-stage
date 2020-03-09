#!/usr/bin/env bash
set -xo pipefail

npm ci
cd backend
npm ci
