module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TYPE "enum_Resources_type" ADD VALUE IF NOT EXISTS \'page\';');
    },

    down(queryInterface, Sequelize) {
        // Nothing to do
    }
};
