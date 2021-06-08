// @ts-nocheck File not migrated fully to TS
/**
 * Created by jakubniezgoda on 08/12/2017.
 */

class FileActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetTextFileContent(file) {
        return this.toolbox
            .getInternal()
            .doUpload('/file/text', { files: { file }, method: 'post', parseResponse: false });
    }

    doGetYamlFileContent(file) {
        return this.toolbox.getInternal().doUpload('/file/yaml', { files: { file }, method: 'post' });
    }
}

Stage.defineCommon({
    name: 'FileActions',
    common: FileActions
});
