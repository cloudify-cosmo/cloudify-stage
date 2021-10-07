const managerIpColumnName = 'managerIp';
const indexWithoutManagerIp = ['username', 'mode', 'tenant'];
const indexWithManagerIp = indexWithoutManagerIp.concat(managerIpColumnName);
const indexOptions = { indicesType: 'UNIQUE' };

module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn('UserApps', managerIpColumnName);
            await queryInterface.sequelize.query(
                `DELETE FROM "UserApps" WHERE id NOT IN (SELECT DISTINCT ON (username,mode,tenant) id FROM "UserApps");`
            );
            await queryInterface.removeIndex('UserApps', indexWithManagerIp, indexOptions);
            await queryInterface.addIndex('UserApps', indexWithoutManagerIp, indexOptions);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn('UserApps', managerIpColumnName, {
                type: Sequelize.STRING,
                notNull: false
            });
            await queryInterface.removeIndex('UserApps', indexWithoutManagerIp, indexOptions);
            await queryInterface.addIndex('UserApps', indexWithManagerIp, indexOptions);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
