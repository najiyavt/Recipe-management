const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Review = sequelize.define('Review' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    comment : {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    recipeId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Recipe',
            key: 'id'
        }
    },
    
});

module.exports = Review;