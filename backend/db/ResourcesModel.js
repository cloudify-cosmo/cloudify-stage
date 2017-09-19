/**
 * Created by pposel on 10/04/2017.
 */

var ResourceTypes = require('./types/ResourceTypes');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Resources',
        {
            resourceId : {type: DataTypes.STRING, allowNull: false},
            type : {type: DataTypes.ENUM, values: ResourceTypes.values, allowNull: false},
            creator : {type: DataTypes.STRING, allowNull: true},
            data : {type: DataTypes.JSONB, allowNull: true}
        },
        { indexes: [{unique: true, fields: ['resourceId']}]}
    );
};
