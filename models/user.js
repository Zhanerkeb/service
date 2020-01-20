'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM,
            values: [
                'admin',
                'user',
            ],
            defaultValue: 'user'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        models.User.hasMany(models.Review, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        models.User.hasMany(models.Order, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        models.User.hasMany(models.Favorites, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };
    return User;
};