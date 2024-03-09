const express = require('express')
const recipeRouter = express.Router()
const recipeController = require('../controllers/recipeController')
const axios = require('axios');
const path = require('path');

const verifyLogin = (req,res,next)=>{
    if(req.session.userLoggedIn){
      next();
    }
    else{
      res.redirect('/signin')
    }
  }

/**
 App routes
 */
recipeRouter.get('/',recipeController.homepage)
recipeRouter.get('/categories',recipeController.exploreCategories)
recipeRouter.get('/recipe/:id',recipeController.exploreRecipes)
recipeRouter.get('/categories/:id',recipeController.exploreCategoriesById)

recipeRouter.post('/search',recipeController.searchRecipe)

recipeRouter.get('/explore-latest',recipeController.exploreLatest)
recipeRouter.get('/explore-random',recipeController.exploreRandom)

recipeRouter.get('/submit-recipe',verifyLogin,recipeController.submitRecipe)
recipeRouter.post('/submit-recipe',verifyLogin,recipeController.submitRecipePost)

recipeRouter.post('/signup',recipeController.signupPost)
recipeRouter.get('/signup',recipeController.signUp)

recipeRouter.get('/signin',recipeController.signIn)
recipeRouter.post('/signin',recipeController.signinPost)

recipeRouter.get('/allrecipes',recipeController.allRecipes)

recipeRouter.get('/profile',verifyLogin,recipeController.userProfile)
recipeRouter.post('/profile',verifyLogin,recipeController.Profile)

recipeRouter.get('/viewList/:id',verifyLogin,recipeController.viewRecipe)

recipeRouter.get('/editList/:id',verifyLogin,(req,res)=>res.redirect('/profile'))
recipeRouter.post('/editList/:id',verifyLogin,recipeController.editRecipes)


recipeRouter.delete('/deleteList/:id',verifyLogin,recipeController.deleteRecipe)


recipeRouter.get('/logout',(req,res)=> {
  req.session.destroy();
  res.redirect('/');
})

recipeRouter.get('/newpage', (req, res) => {
  const meals = [];
  
  const ingredient = "someIngredient";
  
  res.render('newpage', { meals, ingredient });
});

recipeRouter.get('/newpage/search', async (req, res) => {
  try {
      const ingredient = req.query.ingredient;

      if (!ingredient) {
          return res.redirect('/newpage');
      }

      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
      const meals = response.data.meals;

      res.render('newpage', { meals, ingredient });
  } catch (error) {
      console.error(error);
      res.render('error');
  }
});

recipeRouter.get('/cocktail', (req, res) => {
  const cocktails = [];
  const searchTerm = ''; 

  res.render('cocktail', { cocktails, searchTerm });
});

recipeRouter.get('/cocktail/search', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    let cocktails = [];

    if (searchTerm) {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);

      // Check the structure of the API response
      if (response.data.drinks) {
        cocktails = response.data.drinks;
      } else {
        console.error('Invalid API response structure:', response.data);
      }
    }

    res.render('cocktail', { title: 'Cocktail Search', cocktails, searchTerm });
  } catch (error) {
    console.error('Error fetching cocktails:', error);
    res.status(500).send('Error fetching cocktails');
  }
});
recipeRouter.get('/carousel',verifyLogin, (req, res) => {
  
  res.render('carousel');
});

// Trivia route
recipeRouter.get('/foodTrivia', async (req, res) => {
  try {
    const category = 'fooddrink'; // Set the desired category
    const limit = 10; // Set the number of trivia questions you want

    const response = await axios.get(`https://api.api-ninjas.com/v1/trivia?category=${category}&limit=${limit}`, {
      headers: {
        'X-Api-Key': '8MwBbGGypHrsehe2DxsB3w==70y2g4TZkryYEw8z', // Replace with your actual API key
      },
    });

    const questions = response.data;
    res.render('foodTrivia', { questions });
  } catch (error) {
    console.error('Error fetching food trivia questions:', error);
    res.render('error');
  }
});

module.exports = recipeRouter