const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Recipe = sequelize.define('Recipe' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    time : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ingredient : {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    instruction : {
        type: Sequelize.TEXT,
        allowNull: false,
    }, 
     
});

module.exports = Recipe;