var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";

const recipesUtils = require("./utils/recipesUtils");


router.use((req,res,next) => {
    console.log("Recipes route");
    next();
});


router.get("/search/query/:searchQuery/amount/:num", (req, res) => {
    const {searchQuery,num} = req.params;
  
    //set search params
    search_params = {};
    search_params.query = searchQuery;
    search_params.number = num;
    search_params.instructionsRequired = true;
  
    //check if quries params exists
    console.log(req.query);
    recipesUtils.extractQueriesParams(req.query,search_params);

    recipesUtils.searchForRecipes(search_params)
    .then((info_array) =>{
      if (info_array){
        res.send(info_array);
      }      
      else{
        res.status(205).send({message: "No recipes found",success: true,});
      } 
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(404);
    });

});


//3 random recipes
router.get("/random", (req, res) => {

  recipesUtils
  .randomRecipes()
  .then((info_array) => res.send(info_array))
  .catch((error) => {
      console.log(error);
      res.sendStatus(404);
  });

});

//show preview recipe by id
router.get("/previewRecipe/:id", (req, res) => {
  recipesUtils
  .previewRecipeById(req.params)
  .then((info_array) => {
    if (info_array){
      res.send(info_array);
    }
    else {
      res.status(205).send({ message: "recipe not found", success: true });
    }
  })
  .catch((error) => {
    console.log(error);
    //res.send(error);
    res.sendStatus(404);
  });
});

//show full recipe by id
router.get("/showRecipe/:id", (req, res) => {
  recipesUtils
  .showRecipeById(req.params)
  .then((info_array) => {
    if (info_array){
      res.send(info_array);
    }
    else {
      res.status(205).send({ message: "recipe not found", success: true });
    }
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });

});


router.get("/recipeInfo/:ids", (req, res) => {
  const recipes_ids = JSON.parse("["+req.params.ids+"]");
  recipesUtils
    .recipeInfo(recipes_ids)
    .then((info_array) => {
      if (info_array){
        res.send(info_array);
      }
      else {
        res.status(205).send({ message: "No recipes found", success: true });
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(404);
    });
});




module.exports = router;
