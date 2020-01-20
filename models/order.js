'use strict';
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        orderdate:DataTypes.DATE,
        guest:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        userId: DataTypes.INTEGER,
        restaurantId: DataTypes.INTEGER
    }, {});
    Order.associate = function(models) {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
        Order.belongsTo(models.Restaurant, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE',
        });};
    return Order;
};