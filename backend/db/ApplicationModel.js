/**
 * Created by Alex on 21/03/2017.
 */

'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Application', {
        appStatus: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        VMs: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
        isPrivate: { type: DataTypes.BOOLEAN, allowNull: false },
        TDMALCode: { type: DataTypes.STRING, allowNull: true },
        ITNumber: { type: DataTypes.STRING, allowNull: true },
        costCenter: { type: DataTypes.STRING, allowNull: true },
        LoB: { type: DataTypes.STRING, allowNull: true }
    });
};
