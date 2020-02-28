module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'BlueprintUserData',
        {
            blueprintId: { type: DataTypes.INTEGER, allowNull: false },
            username: { type: DataTypes.STRING, allowNull: false },
            layout: { type: DataTypes.JSON, allowNull: false }
        },
        { indexes: [{ unique: true, fields: ['blueprintId', 'username'] }] }
    );
};
