'use strict';
module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
        name: DataTypes.STRING,
        image: {
            type: DataTypes.STRING,
            defaultValue: 'https://cdn.iconscout.com/icon/free/png-256/restaurant-19-118825.png'
        },
        location: DataTypes.TEXT,
        phone: DataTypes.STRING,
        amountOfPlace:DataTypes.INTEGER,
        averageBill:DataTypes.STRING,
        rate: {
            type: DataTypes.DECIMAL,
            defaultValue: 0
        }
    }, {});
    Restaurant.associate = function(models) {
        // associations can be defined here
        models.Restaurant.hasMany(models.ResKitList, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE',
        });
        models.Restaurant.hasMany(models.Review, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE',
        });
        models.Restaurant.hasMany(models.Order, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE'
        });
        models.Restaurant.hasMany(models.Favorites, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE'
        });
    };
    return Restaurant;
};