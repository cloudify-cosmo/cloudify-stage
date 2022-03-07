import type { MigrationObject, QueryInterfaceIndexOptions } from './common/types';

const ROLE_COLUMN_NAME = 'role';
const INDEX_WITHOUT_ROLE = ['managerIp', 'username', 'mode', 'tenant'];
const INDEX_WITH_ROLE = INDEX_WITHOUT_ROLE.concat(ROLE_COLUMN_NAME);
const INDEX_OPTIONS: QueryInterfaceIndexOptions = { type: 'UNIQUE' };

export const { up, down }: MigrationObject = {
    up(queryInterface) {
        return queryInterface
            .removeColumn('UserApps', ROLE_COLUMN_NAME)
            .then(() =>
                queryInterface.sequelize.query(`DELETE FROM "UserApps" WHERE id NOT IN
                                           (SELECT DISTINCT ON ("managerIp",username,mode,tenant) id FROM "UserApps");`)
            )
            .then(() => queryInterface.sequelize.query('DROP TYPE "enum_UserApps_role";'))
            .then(() => queryInterface.removeIndex('UserApps', INDEX_WITH_ROLE, INDEX_OPTIONS))
            .then(() => queryInterface.addIndex('UserApps', INDEX_WITHOUT_ROLE, INDEX_OPTIONS));
    },

    down(queryInterface, Sequelize) {
        return queryInterface
            .addColumn('UserApps', ROLE_COLUMN_NAME, {
                type: Sequelize.ENUM,
                values: ['admin', 'user'],
                defaultValue: 'user'
            })
            .then(() => queryInterface.removeIndex('UserApps', INDEX_WITHOUT_ROLE, INDEX_OPTIONS))
            .then(() => queryInterface.addIndex('UserApps', INDEX_WITH_ROLE, INDEX_OPTIONS));
    }
};
