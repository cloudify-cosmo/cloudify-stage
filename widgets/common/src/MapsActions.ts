import { template } from 'lodash';

class MapsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    public isAvailable() {
        const { urlTemplate } = Stage.Common.Consts.leaflet;
        const testUrl = template(urlTemplate, { interpolate: /{([\s\S]+?)}/g })({ x: 0, y: 0, z: 0, r: '' });

        const noCache = new Date().getTime();
        return this.toolbox
            .getInternal()
            .doGet(testUrl, { params: { noCache } })
            .then(() => true)
            .catch(() => false);
    }
}

declare global {
    namespace Stage.Common {
        export { MapsActions };
    }
}

Stage.defineCommon({
    name: 'MapsActions',
    common: MapsActions
});
