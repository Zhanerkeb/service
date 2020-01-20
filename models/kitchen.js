'use strict';
module.exports = (sequelize, DataTypes) => {
    const Kitchen = sequelize.define('Kitchen', {
        name: DataTypes.STRING
    }, {});
    Kitchen.associate = function(models) {
        models.Kitchen.hasMany(models.ResKitList, {
            foreignKey: 'kitchenId',
            onDelete: 'CASCADE'
        });
    };
    return Kitchen;
};