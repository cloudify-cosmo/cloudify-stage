const DATA_COLUMN_NAME = 'data';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.addColumn('Resources', DATA_COLUMN_NAME, {
            type: Sequelize.JSONB,
            allowNull: true
        });
    },

    down(queryInterface) {
        return queryInterface.removeColumn('Resources', DATA_COLUMN_NAME);
    }
};
