const express = require("express");
const router = express.Router();
// model
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
router.use(express.urlencoded({ extended: false }));

router.get('/sign-up',(req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post('/sign-up', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  
    try {
      const existingUser = await User.findOne({
        username,
      });
  
      if (existingUser) {
        return res.send('Ooops Something went wrong');
      }
  
      if (password !== confirmPassword) {
        return res.send('Password and Confirm Password do not match');
      }
  
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
  
      // req.body.password = hashedPassword;
  
      // Alternative way to creating objects from form submission
      const payload = {
        username,
        password: hashedPassword,
      };
  
      const user = await User.create(payload);
  
      req.session.user = {
        username: user.username,
        _id: user._id,
      };
      res.redirect('/auth/sign-in');
    } catch (error) {
      //throw new Error('Something went wrong');
      console.log(error);
    }
  });

// login 
router.get('/sign-in', (req, res , next ) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-in',async (req, res , next) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findOne({username,});
    if (!existingUser) {
        return res.send('Ooops Something went wrong');
    }

    const validPassword = await bcrypt.compare(password , existingUser.password);
    if (!validPassword){
        res.send('Invalid username or password');
    }
    req.session.user = {
        username: existingUser.username,
        _id: existingUser._id,
    };
    req.session.save(() => {
        res.redirect("/");
      });
});

// logout 

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
      });
  });


module.exports = router;