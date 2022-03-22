// @ts-nocheck File not migrated fully to TS
export default class FileActions {
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
