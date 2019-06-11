#!/usr/bin/env bash
set -x

npm ci
cd backend
npm ci
