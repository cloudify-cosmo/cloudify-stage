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
};

Stage.defineCommon({
    name: 'Consts',
    common: consts
});