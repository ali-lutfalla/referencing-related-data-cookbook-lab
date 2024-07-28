// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');


// router logic will go here - will be built later on in the lab
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find({owner: req.session.user._id });
        res.render('recipes/index.ejs', {
          recipes: recipes,
        })
      } catch (error) {
        console.log(error)
        res.redirect('/')
      }
});

router.get('/new', async (req, res, next) => {
    const ingredients = await Ingredient.find({});
    res.render('recipes/new.ejs',{ingredients: ingredients});
});

router.post('/', async (req, res, next ) => {
    try {
      const newRecipe = new Recipe(req.body);
      newRecipe.owner = req.session.user._id;
      const ingredientNames = req.body.ingredients;
      const ingredientIds = await Ingredient.find({ name: { $in: ingredientNames } }, '_id');
      newRecipe.ingredients = ingredientIds.map(ingredient => ingredient._id);
      
      await newRecipe.save();
      res.redirect(`/users/${req.session.user._id}/recipes/${newRecipe._id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:recipeID', async (req, res, next) => {
    try {
        const currentUser = await User.findOne({_id: req.session.user._id});
        const recipe = await Recipe.findOne({_id: req.params.recipeID}).populate('ingredients');

        res.render('recipes/show.ejs', {
        currentUser: currentUser,
        recipe: recipe
        });
    } catch (error) {
        console.log(error);
    } 
});

router.delete('/:recipeID', async (req, res, next ) => {
    try {
        const recipe = await Recipe.findOne({_id: req.params.recipeID});
        if (recipe.owner.equals(req.session.user._id)) {
            await Recipe.findByIdAndDelete(req.params.recipeID);
            res.redirect(`/users/${req.session.user._id}/recipes`);
        } else {
            res.redirect(`/users/${req.session.user._id}/recipes`);
        }
    } catch (error) {
        console.log(error);
    }
}); 

router.get('/:recipeID/edit', async (req, res, next ) => {
    try {
        const ingredients = await Ingredient.find({});
        const recipe = await Recipe.findOne({_id: req.params.recipeID}).populate('ingredients');
        if (recipe.owner.equals(req.session.user._id)) {
            res.render('recipes/edit.ejs',{recipe: recipe, ingredients: ingredients});
        } else {
            res.redirect(`/users/${req.session.user._id}/recipes`);
        }
    } catch (error) {
        console.log(error);
    }
});

router.put('/:recipeID', async (req, res, next) => {
    try {
        const recipe = await Recipe.findOne({_id: req.params.recipeID});
        if (recipe.owner.equals(req.session.user._id)) {
            recipe.set(req.body);
            await recipe.save();
            res.redirect(`/users/${req.session.user._id}/recipes/${req.params.recipeID}`);
        } else {
            res.redirect(`/users/${req.session.user._id}/recipes`);
        }
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;