// @ts-nocheck File not migrated fully to TS
export {};

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

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { FileActions };
    }
}

Stage.defineCommon({
    name: 'FileActions',
    common: FileActions
});
