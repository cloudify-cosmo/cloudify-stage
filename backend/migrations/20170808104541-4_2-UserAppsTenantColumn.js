const TENANT_COLUMN_NAME = 'tenant';
const INDEX_WITHOUT_TENANT = ['managerIp', 'username', 'role', 'mode'];
const INDEX_WITH_TENANT = INDEX_WITHOUT_TENANT.concat(TENANT_COLUMN_NAME);
const INDEX_OPTIONS = { indicesType: 'UNIQUE' };

function createTenantColumnInUserAppTable(queryInterface, Sequelize) {
    return queryInterface
        .addColumn('UserApps', TENANT_COLUMN_NAME, {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'default_tenant'
        })
        .then(function() {
            return queryInterface.removeIndex('UserApps', INDEX_WITHOUT_TENANT, INDEX_OPTIONS);
        })
        .then(function() {
            return queryInterface.addIndex('UserApps', INDEX_WITH_TENANT, INDEX_OPTIONS);
        });
}

function removeTenantColumnInUserAppTable(queryInterface, Sequelize) {
    return queryInterface
        .removeColumn('UserApps', TENANT_COLUMN_NAME)
        .then(function() {
            return queryInterface.sequelize.query(`DELETE FROM "UserApps" WHERE id NOT IN
                                              (SELECT DISTINCT ON ("managerIp",username,role,mode) id FROM "UserApps");`);
        })
        .then(function() {
            return queryInterface.removeIndex('UserApps', INDEX_WITH_TENANT, INDEX_OPTIONS);
        })
        .then(function() {
            return queryInterface.addIndex('UserApps', INDEX_WITHOUT_TENANT, INDEX_OPTIONS);
        });
}

module.exports = {
    up(queryInterface, Sequelize) {
        return createTenantColumnInUserAppTable(queryInterface, Sequelize);
    },

    down(queryInterface, Sequelize) {
        return removeTenantColumnInUserAppTable(queryInterface, Sequelize);
    }
};
