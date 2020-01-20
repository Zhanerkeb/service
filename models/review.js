'use strict';
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        text: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {});
    Review.associate = function(models) {
        models.Review.belongsTo(models.User, {
            foreignKey: 'reviewId',
            onDelete: 'CASCADE'
        });
    };
    Review.associate = function(models) {
        models.Review.belongsTo(models.Restaurant, {
            foreignKey: 'restaurantId',
            onDelete: 'CASCADE'
        });
    };
    return Review;
};