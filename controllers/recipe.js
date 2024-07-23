const { Op, where } = require('sequelize');
const Recipe = require('../models/recipe');
const Review = require('../models/review');
const User = require('../models/user');

exports.addRecipe = async ( req , res) => {
    const { name , time , instruction , ingredient } = req.body;
    try{
        const newRecipe = await Recipe.create({ 
            name , time , instruction , ingredient , UserId:req.user.id
        });
        res.status(200).json({ newRecipe, success: true, message: 'New recipe created' });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while creating new recipe' })
    }
}

exports.getRecipe = async ( req , res) => {
    try{ 
        const recipe = await Recipe.findAll({where: { UserId: req.user.id}});

        if(!recipe || recipe.length === 0){
            return res.status(404).json({ error: 'reciepe not found!!' });
        }
        res.status(200).json({ success: true, message: 'Recipe fetched successfully' ,recipe});
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while fetching recipe ' })
    }
};

exports.deleteRecipe = async (req , res) => {
    const {id} = req.params;
    try{
        const recipe = await Recipe.findByPk(id);
        if(!recipe){
            return res.status(404).json({ error: 'reciepe not found!!' });
        }
        await recipe.destroy();
        res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting recipe' });
    }
};

exports.editProfile = async( req ,res) => {
    const {id} = req.params;
    const { name , time , instruction , ingredient } = req.body;
    try{
        const recipe = await Recipe.findByPk(id);
        if(!recipe){
            return res.status(404).json({ error: 'reciepe not found!!' });
        };
        recipe.name = name;
        recipe.time = time;
        recipe.instruction = instruction;
        recipe.ingredient = ingredient;
        await recipe.save();
        res.status(200).json({ message: 'Recipe updated successfully', recipe });
    }catch (error) {
        res.status(500).json({ error: 'Server error while updating recipe' });
    }
}

exports.searchRecipe = async (req, res) => {
    const search = req.query.search || '' ;
    try{
        const options = {
            where: {
                name: {
                    [Op.like]: `%${search}%` // Search for recipes containing the search query
                }
            }  ,include: [{
                model: User,
                attributes: ['username'] // Include the username of the creator
            }]      
        };
        const searchRecipes = await Recipe.findAll(options); 
        console.log('searchRecipes:', searchRecipes);
        if (searchRecipes.length === 0) {
            return res.status(404).json({ error: 'No recipes found!' });
        }
        res.status(200).json({ success: true, message: 'Recipes searched successfully', searchRecipes });
    }catch (error) {
        res.status(500).json({ error: 'Server error while searching recipes' });
    }
};

exports.browseRecipe = async (req, res) => {
    try{
        const browseRecipes = await Recipe.findAll({
            include: [{
                model: User,
                attributes: ['username'] // Include the username of the creator
            }]
        }); 
        if (browseRecipes.length === 0) {
            return res.status(404).json({ error: 'No recipes found!' });
        }
        res.status(200).json({ success: true, message: 'Recipes browse successfully', browseRecipes });
    }catch (error) {
        res.status(500).json({ error: 'Server error while searching recipes' });
    }
};
