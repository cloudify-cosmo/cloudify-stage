/**
 * Created by pposel on 07/06/2017.
 */

var pathlib = require('path');

module.exports = {
    props: {
        path: filename => pathlib.resolve('e2e/resources/' + filename),
        blankFile: pathlib.resolve('e2e/resources/blank.file'),
        blueprint: blueprintName => pathlib.resolve('e2e/resources/' + blueprintName + '.zip'),
        testWidget: pathlib.resolve('e2e/resources/testWidget.zip')
    }
};
