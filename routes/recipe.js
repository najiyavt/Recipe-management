const express = require('express');
const router = express.Router();
const authetication = require('../middleware/auth');
const recipe = require('../controllers/recipe');

    router.post('/add-recipe', authetication.authenticate , recipe.addRecipe);
    router.get('/get-recipe', authetication.authenticate , recipe.getRecipe );
    router.delete('/delete-recipe/:id', authetication.authenticate , recipe.deleteRecipe );
    router.put('/edit-recipe/:id', authetication.authenticate , recipe.editProfile );
    router.get('/search-recipe' , recipe.searchRecipe);
    router.get('/browse-recipes' , recipe.browseRecipe);

module.exports=router;