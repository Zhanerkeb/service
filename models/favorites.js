'use strict';
module.exports = (sequelize, DataTypes) => {
    const Favorites = sequelize.define('Favorites', {

    }, {});
    Favorites.associate = function(models) {
        Favorites.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        Favorites.belongsTo(models.Restaurant, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE',
        });};
    return Favorites;
};