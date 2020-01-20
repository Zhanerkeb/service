'use strict';
module.exports = (sequelize, DataTypes) => {
    const ResKitList = sequelize.define('ResKitList', {
    }, {});
    ResKitList.associate = function(models) {
        // associations can be defined here
        models.ResKitList.belongsTo(models.Restaurant, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE'
        });
        models.ResKitList.belongsTo(models.Kitchen, {
            foreignKey: 'kitchenId',
            onDelete: 'CASCADE'
        });
    };
    return ResKitList;
};