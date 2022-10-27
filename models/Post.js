const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init(
    {
        id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },

        title : {
            type : DataTypes.STRING,
            allowNull : false,
        },

        content : {
            type : DataTypes.TEXT('long'),
            allowNull : false,
            
        },

        author_id : {
            type : DataTypes.INTEGER,
            references : {
                model : 'user',
                key : 'id',
            },
        },
    },
    {
        sequelize,
        underscored : true,
        freezeTableName : true,
        modelName : 'post',
    }
);

module.exports = Post;