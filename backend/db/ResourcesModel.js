/**
 * Created by pposel on 10/04/2017.
 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Resources',
        {
            resourceId : {type: DataTypes.STRING, allowNull: false},
            type : {type: DataTypes.ENUM, values: ['widget','template'], allowNull: false},
            creator : {type: DataTypes.STRING, allowNull: true}
        },
        { indexes: [{unique: true, fields: ['resourceId']}]}
    );
};
