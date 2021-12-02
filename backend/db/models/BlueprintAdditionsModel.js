module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'BlueprintAdditions',
        {
            blueprintId: { type: DataTypes.STRING, allowNull: false },
            image: { type: DataTypes.BLOB, allowNull: true },
            imageUrl: { type: DataTypes.STRING, allowNull: true }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['blueprintId']
                }
            ]
        }
    );
