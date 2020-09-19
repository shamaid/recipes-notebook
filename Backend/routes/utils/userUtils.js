const axios = require("axios");

const recipes_api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=" + process.env.spooncular_apiKey;
const DButils = require("./DButils");

async function recipeInfo(req) {
  try {
    const ids = req.params.ids;
    const user_id = req.session.user_id;
    const userRecipesData = await DButils.getUserInfoOnRecipes(user_id, ids);
    let ids_array = ids.split(",");
    let sentInfoOnRecipesids = orderUserRecipeToReturn(
      userRecipesData,
      ids_array
    );
    return sentInfoOnRecipesids;
  } catch (error) {
    return error;
  }
}

function orderUserRecipeToReturn(userRecipesData, ids) {
  let foundRecipesids = [];
  let sentInfoOnRecipesids = {};
  for (let i = 0; i < userRecipesData.length; i++) {
    foundRecipesids.push(userRecipesData[i].recipe_id);
  }
  for (let i = 0; i < ids.length; i++) {
    if (!foundRecipesids.includes(ids[i])) {
      let info = { watched: false, saved: false };
      sentInfoOnRecipesids[ids[i]] = info;
    }
  }
  for (let i = 0; i < userRecipesData.length; i++) {
    let currentRecipe = userRecipesData[i];
    let recipe_id = currentRecipe.recipe_id;
    let value = { watched: true, saved: currentRecipe.saved };
    sentInfoOnRecipesids[recipe_id] = value;
  }
  return sentInfoOnRecipesids;
}

async function viewRecipe(req) {
  try {
    const user_id = req.session.user_id;
    const id = req.params.id;
    const userRecipeData = await DButils.getUserInfoOnRecipes(user_id, id);
    if (userRecipeData.length != 0) {
      await DButils.updateNewRecipeView(user_id, id);
    } else {
      await DButils.insertNewRecipeView(user_id, id);
    }
    return "OK";
  } catch (error) {
    return error;
  }
}

async function likeRecipe(req) {
  try {
    const id = req.params.id;
    const user_id = req.session.user_id;
    const userRecipeData = await DButils.getUserInfoOnRecipes(user_id, id);
    if (userRecipeData.length == 0) {
      await DButils.insertNewRecipeView(user_id, id);
    }
    await DButils.likeRecipe(user_id, id);
    return "Ok";
  } catch (error) {
    return error;
  }
}

async function lastviewed(req, res) {
  try {
    const user_id = req.user.user_id;
    const viewed_recipes = await DButils.getLastThreeView(user_id);
    let viewed_recipes_ids = [];

    viewed_recipes.forEach((recipe) => {
      viewed_recipes_ids.push({ recipe_id: recipe.recipe_id });
    });

    if (viewed_recipes_ids.length === 0) {
        res.status(205).send({
        message: "No recipes were watched",
        success: true,
      });
    } else {
      res.status(200).send(viewed_recipes_ids);
    }
  } catch (error) {
    return error;
  }
}

async function getUserRecipe(req, res) {
  try {
    const user_id = req.user.user_id;
    const recipe_id = req.params.recipe_id;
    let sentInfoOnRecipesids = {};
    const recipe = await DButils.getUserRecipe(user_id, recipe_id);
    if (recipe.length != 0) {
      let json_details = JSON.parse(recipe[0].details);
      let json_recipe = extractUserRecipe(json_details);
      sentInfoOnRecipesids[recipe_id] = json_recipe;
      res.status(200).send(sentInfoOnRecipesids);
    } else {res.status(401);}
  } catch (error) {
    return error;
  }
}

function extractUserRecipe(recipes_info) {
  const {
    id,
    title,
    readyInMinutes,
    aggregateLikes,
    vegetarian,
    vegan,
    glutenFree,
    image,
    instructions,
    ingredients
  } = recipes_info;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    aggregateLikes: aggregateLikes,
    vegetarian: vegetarian,
    vegan: vegan,
    glutenFree: glutenFree,
    image: image,
    instructions:instructions,
    ingredients:ingredients
  };
}

async function getUserAllRecipes(req, res) {
  try {
    const user_id = req.user.user_id;
    const recipes = await DButils.getAllUserRecipes(user_id);
    let sentInfoOnRecipesids = {};
    let found = false;
    for (let i = 0; i < recipes.length; i++) {
      let json_details = JSON.parse(recipes[i].details);
      let json_recipe = extractUserRecipe(json_details);
      sentInfoOnRecipesids[recipes[i].recipe_id] = json_recipe;
     found = true;
    }
    if(found){
      return sentInfoOnRecipesids;
      }else{
        return null;
      }
  } catch (error) {
    return error;
  }
}

async function getUserFamilyRecipe(req, res) {
  try {
    const user_id = req.user.user_id;
    const recipe_id = req.params.recipe_id;
    const recipe = await DButils.getUserFamilyRecipe(user_id, recipe_id);
    let sentInfoOnRecipesids = {};
    if (recipe.length != 0) {
      let json_details = JSON.parse(recipe[0].details);
      let json_recipe = extractUserFamilyRecipe(json_details);
      sentInfoOnRecipesids[recipe_id] = json_recipe;
      res.status(200).send(sentInfoOnRecipesids);
    } else res.status(401);
  } catch (error) {
    return error;
  }
}

async function getAllUserFamilyRecipes(req, res) {
  try {
    const user_id = req.user.user_id;
    const recipes = await DButils.getAllUsersFamilyRecipes(user_id);
    let sentInfoOnRecipesids = {};
    let found = false;
    for (let i = 0; i < recipes.length; i++) {
      let json_details = JSON.parse(recipes[i].details);
      let json_recipe = extractUserFamilyRecipe(json_details);
      sentInfoOnRecipesids[recipes[i].recipe_id] = json_recipe;
      found = true;
    }
    if(found){
      return sentInfoOnRecipesids;
      }else{
        return null;
      }
  } catch (error) {
    return error;
  }
}

function extractUserFamilyRecipe(recipes_info) {
  sentInfoOnRecipesids = {};
  let recipe = recipes_info;

  const {
    recipeOwner,
    recipeStory,
    title,
    readyInMinutes,
    image,
    servings,
    ingredients,
    instructions,
    extendedIngredients,
    
  } = recipe;

  const info = {
    recipeOwner: recipeOwner,
    recipeStory: recipeStory,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    servings: servings,
    ingredients: ingredients,
    instructions: instructions,
    extendedIngredients:extendedIngredients
  };

  return info;
}

async function getAllSaved(req, res) {
  try {
    const user_id = req.session.user_id;
    const allSaved = await DButils.getAllSaved(user_id);
    if (allSaved.length === 0) {
     return null;
    } else {
      return allSaved;
    }
  } catch (error) {
    return error;
  }
}

async function getUserPorfilePicture(req, res) {
  try {
    const user_id = req.session.user_id;
    const image = await DButils.getUserPorfilePicture(user_id);
    console.log(image[0].image);
    res.send(image[0].image);
    //return image;
  } catch (error) {
    return error;
  }
}

exports.recipeInfo = recipeInfo;
exports.viewRecipe = viewRecipe;
exports.likeRecipe = likeRecipe;
exports.lastviewed = lastviewed;
exports.getUserRecipe = getUserRecipe;
exports.getUserAllRecipes = getUserAllRecipes;
exports.getUserFamilyRecipe = getUserFamilyRecipe;
exports.getAllUserFamilyRecipes = getAllUserFamilyRecipes;
exports.getAllSaved = getAllSaved;
exports.getUserPorfilePicture = getUserPorfilePicture;
