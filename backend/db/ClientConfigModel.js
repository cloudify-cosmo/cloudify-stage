/**
 * Created by kinneretzin on 08/03/2017.
 */

module.exports = function(sequelize, DataTypes) {
    var ClientConfig =sequelize.define('ClientConfig',{
        managerIp : {type: DataTypes.STRING, allowNull: false },
        config: { type: DataTypes.JSON,allowNull: false}

    },{
        indexes: [
            {
                unique: true,
                fields: ['managerIp']
            }
        ]
    });

    return ClientConfig;
};
