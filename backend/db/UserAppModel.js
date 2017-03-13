/**
 * Created by kinneretzin on 13/02/2017.
 */


module.exports = function(sequelize, DataTypes) {
    var UserApp =sequelize.define('UserApp',{
        managerIp : {type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false},
        appDataVersion: {type: DataTypes.INTEGER, allowNull: false},
        mode: {type: DataTypes.ENUM, values: ['customer','main'], allowNull: false, default: 'main'},
        role: {type: DataTypes.ENUM, values: ['admin','user'], allowNull: false, default: 'user'},
        appData: { type: DataTypes.JSON,allowNull: false}

        },{
        indexes: [
            {
                unique: true,
                fields: ['managerIp','username','role','mode']
            }
        ]
    });

    return UserApp;
};
