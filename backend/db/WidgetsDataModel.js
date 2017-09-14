/**
 * Created by jakubniezgoda on 14/09/2017.
 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('WidgetsData',
        {
            widget : {type: DataTypes.STRING, allowNull: false},
            user : {type: DataTypes.STRING, allowNull: false},
            key : {type: DataTypes.STRING, allowNull: false},
            value : {type: DataTypes.JSON, allowNull: false}
        },
        { indexes: [{unique: true, fields: ['widget', 'user', 'key']}]}
    );
};
