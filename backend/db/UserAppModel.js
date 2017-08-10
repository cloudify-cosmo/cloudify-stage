/**
 * Created by kinneretzin on 13/02/2017.
 */
var ServerSettings = require('../serverSettings');

module.exports = function(sequelize, DataTypes) {
    var UserApp = sequelize.define('UserApp', {
        managerIp: {type: DataTypes.STRING, allowNull: false},
        username: {type: DataTypes.STRING, allowNull: false},
        appDataVersion: {type: DataTypes.INTEGER, allowNull: false},
        mode: {type: DataTypes.ENUM,
               values: [
                   ServerSettings.MODE_CUSTOMER,
                   ServerSettings.MODE_MAIN,
                   ServerSettings.MODE_COMMUNITY
               ],
               allowNull: false,
               default: ServerSettings.MODE_MAIN},
        role: {type: DataTypes.ENUM, values: ['admin', 'user'], allowNull: false, default: 'user'},
        tenant: {type: DataTypes.STRING, allowNull: false, default: 'default_tenant'},
        appData: {type: DataTypes.JSON, allowNull: false}
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['managerIp','username','role','mode','tenant']
            }
        ]
    });

    return UserApp;
};
