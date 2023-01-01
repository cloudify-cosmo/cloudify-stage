import type { MapOptions } from 'leaflet';
import appConsts from '../../utils/consts';
import type { Visibility } from './types';

const defaultVisibility: Visibility = 'tenant';

const consts = {
    defaultVisibility,
    defaultBlueprintYamlFileName: 'blueprint.yaml',
    sysAdminRole: appConsts.ROLE.SYS_ADMIN,
    defaultUserRole: appConsts.ROLE.DEFAULT,
    adminUsername: appConsts.DEFAULT_ADMIN_USERNAME,
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
    },
    allowedVisibilitySettings: [defaultVisibility, appConsts.GLOBAL_VISIBILITY] as Visibility[],
    drilldownPage: {
        blueprintMarketplace: 'blueprintMarketplace'
    },
    emailRegex: appConsts.EMAIL_REGEX,
    idRegex: appConsts.ID_REGEX
} as const;

export default consts;
