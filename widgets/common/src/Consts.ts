const consts = {
    defaultVisibility: 'tenant',
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
        },
        initialZoom: 2.5,
        urlTemplate: '/maps/{z}/{x}/{y}/{r}'
    }
};

declare namespace Stage {
    interface Common {
        Consts: typeof consts;
    }
}

Stage.defineCommon({
    name: 'Consts',
    common: consts
});
