/**
 * Created by pposel on 09/03/2017.
 */


module.exports = function(sequelize, DataTypes) {
    var BlueprintAdditions =sequelize.define('BlueprintAdditions',
        {
            blueprintId : {type: DataTypes.STRING, allowNull: false },
            image: { type: DataTypes.BLOB, allowNull: true},
            imageUrl: { type: DataTypes.STRING, allowNull: true}
        },
        { indexes: [
            {
                unique: true,
                fields: ['blueprintId']
            }
        ]
    });

    return BlueprintAdditions;
};
