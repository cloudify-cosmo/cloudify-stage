/**
 * Created by kinneretzin on 02/03/2017.
 */

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
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 0.75
        },
        initialZoom: 2.5
    },
    externalUrls: {
        pluginsCatalog: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json',
        blueprintsCatalog: 'http://repository.cloudifysource.org/cloudify/blueprints/5.1/examples.json',
        helloWorldBlueprint: 'https://github.com/cloudify-cosmo/cloudify-hello-world-example/archive/master.zip'
    }
};

Stage.defineCommon({
    name: 'Consts',
    common: consts
});
