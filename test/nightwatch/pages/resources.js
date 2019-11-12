/**
 * Created by pposel on 07/06/2017.
 */

const pathlib = require('path');

module.exports = {
    props: {
        fileByName: (filename, globals) =>
            globals.usePathResolutionForResources
                ? pathlib.resolve(`${globals.resourcesPath}${filename}`)
                : `${globals.resourcesPath}${filename}`,
        blankFile: globals =>
            globals.usePathResolutionForResources
                ? pathlib.resolve(`${globals.resourcesPath}blank.file`)
                : `${globals.resourcesPath}blank.file`,
        testWidget: (globals, suffix = '') =>
            globals.usePathResolutionForResources
                ? pathlib.resolve(`${globals.resourcesPath}testWidget${suffix}.zip`)
                : `${globals.resourcesPath}testWidget${suffix}.zip`
    }
};
