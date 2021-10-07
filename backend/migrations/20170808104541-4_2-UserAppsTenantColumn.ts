import sequelize, { QueryInterface, QueryInterfaceIndexOptions } from 'sequelize';

const TENANT_COLUMN_NAME = 'tenant';
const INDEX_WITHOUT_TENANT = ['managerIp', 'username', 'role', 'mode'];
const INDEX_WITH_TENANT = INDEX_WITHOUT_TENANT.concat(TENANT_COLUMN_NAME);
const INDEX_OPTIONS: QueryInterfaceIndexOptions = { type: 'UNIQUE' };

function createTenantColumnInUserAppTable(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
    return queryInterface
        .addColumn('UserApps', TENANT_COLUMN_NAME, {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'default_tenant'
        })
        .then(() => queryInterface.removeIndex('UserApps', INDEX_WITHOUT_TENANT, INDEX_OPTIONS))
        .then(() => queryInterface.addIndex('UserApps', INDEX_WITH_TENANT, INDEX_OPTIONS));
}

function removeTenantColumnInUserAppTable(queryInterface: QueryInterface) {
    return queryInterface
        .removeColumn('UserApps', TENANT_COLUMN_NAME)
        .then(() =>
            queryInterface.sequelize.query(`DELETE FROM "UserApps" WHERE id NOT IN
                                      (SELECT DISTINCT ON ("managerIp",username,role,mode) id FROM "UserApps");`)
        )
        .then(() => queryInterface.removeIndex('UserApps', INDEX_WITH_TENANT, INDEX_OPTIONS))
        .then(() => queryInterface.addIndex('UserApps', INDEX_WITHOUT_TENANT, INDEX_OPTIONS));
}

export const { up, down } = {
    up(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
        return createTenantColumnInUserAppTable(queryInterface, Sequelize);
    },

    down(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
        return removeTenantColumnInUserAppTable(queryInterface);
    }
};
