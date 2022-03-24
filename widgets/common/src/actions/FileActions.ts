export default class FileActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGetTextFileContent(file: File) {
        return this.toolbox
            .getInternal()
            .doUpload('/file/text', { files: { file }, method: 'post', parseResponse: false });
    }

    doGetYamlFileContent(file: File): Promise<Record<string, any>> {
        return this.toolbox.getInternal().doUpload('/file/yaml', { files: { file }, method: 'post' }) as Promise<
            Record<string, any>
        >;
    }
}
