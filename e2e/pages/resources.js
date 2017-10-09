/**
 * Created by pposel on 07/06/2017.
 */

var pathlib = require('path');

module.exports = {
    props: {
        blankFile: (globals) => globals.usePathResolutionForResources
                                ? pathlib.resolve(globals.resourcesPath + 'blank.file')
                                : `${globals.resourcesPath}blank.file`,
        testWidget: (globals) => globals.usePathResolutionForResources
                                    ? pathlib.resolve(globals.resourcesPath + 'testWidget.zip')
                                    : `${globals.resourcesPath}testWidget.zip`
    }
};
