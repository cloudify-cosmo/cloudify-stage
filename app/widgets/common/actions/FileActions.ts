import type { PostFileTextResponse, PostFileYamlResponse } from 'backend/routes/File.types';

export default class FileActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGetTextFileContent(file: File) {
        return this.toolbox
            .getInternal()
            .doUpload<PostFileTextResponse>('/file/text', { files: { file }, method: 'post', parseResponse: false });
    }

    doGetYamlFileContent<YamlResponse extends PostFileYamlResponse>(file: File) {
        return this.toolbox.getInternal().doUpload<YamlResponse>('/file/yaml', { files: { file }, method: 'post' });
    }
}
