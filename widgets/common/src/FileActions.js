/**
 * Created by jakubniezgoda on 08/12/2017.
 */

class FileActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetTextFileContent(file) {
        return this.toolbox.getInternal().doUpload('/file/text', null, { file }, 'post', false);
    }

    doGetYamlFileContent(file) {
        return this.toolbox.getInternal().doUpload('/file/yaml', null, { file }, 'post');
    }
}

Stage.defineCommon({
    name: 'FileActions',
    common: FileActions
});
