const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const port = process.env.PORT ? process.env.PORT : '3000';

require('./config/database.js');

// controllers

const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// server.js

app.use(passUserToView);

app.get('/', (req, res) => {
    if (req.session.user) {
      res.redirect(`/users/${req.session.user._id}/recipes`)
    } else {
      res.render('index.ejs')
    }
  });

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/recipes', recipesController);
app.use('/users/:userId/ingredients', ingredientsController);

// code here

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });
  

