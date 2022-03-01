import type { MapOptions } from 'leaflet';

const consts = {
    defaultVisibility: 'tenant',
    defaultBlueprintYamlFileName: 'blueprint.yaml',
    sysAdminRole: 'sys_admin',
    defaultUserRole: 'default',
    adminUsername: 'admin',
    licenseEdition: {
        premium: 'Premium',
        spire: 'Spire'
    },
    leaflet: {
        mapOptions: {
            minZoom: 2,
            maxZoom: 18,
            maxBounds: [
                [-90, -180],
                [90, 180]
            ],
            maxBoundsViscosity: 0.75
        } as MapOptions,
        initialZoom: 2.5,
        urlTemplate: '/maps/{z}/{x}/{y}/{r}'
    }
} as const;

declare global {
    namespace Stage.Common {
        const Consts: typeof consts;
    }
}

export default consts;

Stage.defineCommon({
    name: 'Consts',
    common: consts
});
