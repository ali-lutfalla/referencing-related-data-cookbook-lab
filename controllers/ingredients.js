const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find({});
        res.render('ingredients/index.ejs',{ingredients: ingredients});
    } catch (error) {
        console.log(error);
    }
});

router.post('/',async (req, res, next) => {
    try {
        const newIngredient = new Ingredient(req.body);
        await newIngredient.save();
        res.redirect(`/users/${req.session.user._id}/ingredients`);
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;