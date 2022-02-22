#!/bin/sh

# helper to build deploymentList and to create zip archive
npm run build
cd ../dist/appData/widgets
zip -r -FS ../../../widgets/deploymentList.zip deploymentList/
cd ../../../widgets
