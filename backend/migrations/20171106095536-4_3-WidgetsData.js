'use strict';

function createWidgetsDataModel (queryInterface,Sequelize) {
    return queryInterface.createTable('WidgetsData', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        widget : {type: Sequelize.STRING, allowNull: false},
        user : {type: Sequelize.STRING, allowNull: false},
        key : {type: Sequelize.STRING, allowNull: false},
        value : {type: Sequelize.JSON, allowNull: false},
        createdAt: {type: Sequelize.DATE, allowNull: false},
        updatedAt: {type: Sequelize.DATE, allowNull: false}
    }).then(function() {
        return queryInterface.addIndex(
            'WidgetsData',
            ['widget', 'user', 'key'],
            { indicesType: 'UNIQUE' }
        )
    });
}

module.exports = {
    up: function (queryInterface, Sequelize) {
        return createWidgetsDataModel(queryInterface,Sequelize);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('WidgetsData');
    }
};
