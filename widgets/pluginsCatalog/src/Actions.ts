export default class Actions {
    constructor(private readonly toolbox: Stage.Types.Toolbox, private readonly jsonPath: string) {}

    doGetPluginsList() {
        return this.toolbox
            .getInternal()
            .doGet('/external/content', { params: { url: this.jsonPath }, parseResponse: false })
            .then(response => response.json());
    }

    doUpload(
        { url: wagonUrl, yamlUrl, icon: iconUrl, title }: { url: string; yamlUrl: string; icon: string; title: string },
        visibility: string
    ) {
        const params = {
            visibility,
            wagonUrl,
            yamlUrl,
            iconUrl,
            title
        };

        return this.toolbox.getInternal().doUpload('/plugins/upload', { params, method: 'post' });
    }
}
