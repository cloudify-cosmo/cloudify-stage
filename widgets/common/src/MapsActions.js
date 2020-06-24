class MapsActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    isAvailable() {
        const { urlTemplate } = Stage.Common.Consts.leaflet;
        const testUrl = _.template(urlTemplate, { interpolate: /{([\s\S]+?)}/g })({ x: 0, y: 0, z: 0, r: '' });

        return this.toolbox
            .getInternal()
            .doGet(testUrl)
            .then(() => true)
            .catch(() => false);
    }
}

Stage.defineCommon({
    name: 'MapsActions',
    common: MapsActions
});
