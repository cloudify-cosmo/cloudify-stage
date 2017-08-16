/**
 * Created by kinneretzin on 13/02/2017.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users',
        {
            username: { type: DataTypes.STRING, allowNull: false},
            role: {type: DataTypes.ENUM, values: ['admin','user'], allowNull: false, default: 'user'},
            managerToken: { type: DataTypes.STRING, allowNull: true}
        },{
        indexes: [
            {
                unique: true,
                fields: ['username', 'role', 'managerToken']
            }
        ]
    });
};
