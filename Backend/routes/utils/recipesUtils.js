const axios = require("axios");

const recipes_api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey="+process.env.spooncular_apiKey;


//search recipes

function extractQueriesParams(query_params, search_params){

    const params_list=["diet","cuisine","intolerance"];
    params_list.forEach((param)=>{
        if (query_params[param]){
            search_params[param]=query_params[param];
        }
    });
    console.log(search_params);
}


async function searchForRecipes(search_params){
    let search_response=await axios.get(
        `${recipes_api_url}/search?${api_key}&instructionsRequired=true`,
        {
            params: search_params,
        }
    );

    const recipes_id_list=extractSearchResultIds(search_response);
    console.log(recipes_id_list);
    //Get recipe info by id
    let info_array=await getRecipesInfo(recipes_id_list);
    console.log("info array:" , info_array);
    return info_array;
}

async function getRecipesInfo(recipes_id_list){
    let promises=[];
    recipes_id_list.map((id)=> promises.push(axios.get(`${recipes_api_url}/${id}/information?${api_key}`)));
    let info_response1= await Promise.all(promises);
    console.log(info_response1);
    relevantRecipesData=extractRelevantRecipeData(info_response1);
    return relevantRecipesData;
}

function extractRelevantRecipeData(userRecipesData){

    let recipes_information = [];

    for (let i = 0; i < userRecipesData.length; i++) { 
        let recipe = userRecipesData[i].data;
        recipes_information.push(recipe);
    }


    let foundRecipesids = []
    let sentInfoOnRecipesids = {};
    let ids=[];   
    recipes_information.forEach(recipe => {
    ids.push({id: recipe.id})
    });

    
    foundRecipesids = recipes_information.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
          } = recipe_info;

          const info = {
            id:id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
          };

          return info;
    });
    

    for (let i = 0; i < userRecipesData.length; i++) { 
        let id = ids[i].id;
        let recipe = foundRecipesids[i];
        sentInfoOnRecipesids[id] = recipe;
        console.log(sentInfoOnRecipesids[id]);
    }

    return sentInfoOnRecipesids;
}

function extractSearchResultIds(search_response){
    let recipes = search_response.data.results;
    recipes_id_list=[];
    recipes.map((recipe)=>{
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}

//random recipes

async function randomRecipes(){
    let random_response = await axios.get(`${recipes_api_url}/random?${api_key}&number=3&instructionsRequired=true`);
    console.log(random_response);
    return extractRandomRecipes(random_response);
    
}


function extractRandomRecipes(recipes_Info){
    let recipes = recipes_Info.data.recipes;
    let ids=[];

    recipes.forEach(recipe => {
    ids.push({id: recipe.id})
    });
    console.log(ids);
    console.log(recipes);
    let recipes_respons = randomRecipesOrder(recipes,ids);
    return recipes_respons;
}


function randomRecipesOrder(userRecipesData,ids){
    let foundRecipesids = []
    let sentInfoOnRecipesids = {};
   

    foundRecipesids = userRecipesData.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
          } = recipe_info;

          const info = {
            id:id, 
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
          };

          return info;
    });

    
    for (let i = 0; i < userRecipesData.length; i++) { 
        let id = ids[i].id;
        let recipe = foundRecipesids[i];
        sentInfoOnRecipesids[id] = recipe;
        console.log(sentInfoOnRecipesids[id]);
    }

    return sentInfoOnRecipesids;
  }
  
 
//show preview recipe by id  
async function previewRecipeById(parm){
    try{
    let recipeInfo =[];
    recipeInfo.push(await axios.get(`${recipes_api_url}/${parm.id}/information?${api_key}`));
    
    recipesData=extractRelevantRecipeData(recipeInfo);
    return recipesData;
    } catch (error) {
        throw { status: 404, message: `A recipe with the id ${parm.id} does not exist.` };
    }
}


//show recipes

//show recipe by id 
async function showRecipeById(parm){
    try{
    let recipeInfo =[];
    recipeInfo.push(await axios.get(`${recipes_api_url}/${parm.id}/information?${api_key}`));
    console.log(recipeInfo);
    recipesData=extractRecipeData(recipeInfo);
    return recipesData[0];
    } catch (error) {
        throw { status: 404, message: `A recipe with the id ${parm.id} does not exist.` };
    }
}

function extractRecipeData(userRecipesData){

    let recipes_information = [];
    let sentInfoOnRecipesids = {};

    for (let i = 0; i < userRecipesData.length; i++) { 
        let recipe = userRecipesData[i].data;
        recipes_information.push(recipe);
    }

    return recipes_information.map((recipe_info) => {
        const {
          id,
          title,
          readyInMinutes,
          aggregateLikes,
          vegetarian,
          vegan,
          glutenFree,
          image,
          servings,
        } = recipe_info;
        
        const info =  {
          id:id,
          title: title,
          readyInMinutes: readyInMinutes,
          aggregateLikes: aggregateLikes,
          vegetarian: vegetarian,
          vegan: vegan,
          glutenFree: glutenFree,
          image: image,
          servings : servings,
        };


        let ingredients=[]
        ingredients = addIngredients(recipe_info);
        info.ingredients=ingredients[0]; 
        info.extendedIngredients = recipe_info.extendedIngredients;


        if(recipe_info.instructions !== null){

            let instructions=[]
            instructions =addInstructions(recipe_info);
            info.instructions=instructions[0];    
        }else{
            info.instructions="There are no instructions for this recipe"
        }

        sentInfoOnRecipesids[recipe_info.id]=info;
        return sentInfoOnRecipesids;

      });
}

function addIngredients(recipe_info){
    let ingredients=[]
    ingredients.push(recipe_info.extendedIngredients.map((ingredient) =>{
        let unit_defult = ingredient.unit;
        let amount_defult = ingredient.amount;
        if(unit_defult == ""){
            if(amount_defult <= 1){
                ingredient.unit="unit";
            }
            else{
                ingredient.unit="units";
            }
        }
    return{
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
    }}
    ));
    return ingredients;
}

function addInstructions(recipe_info){
    let instructions=[]
    instructions.push(recipe_info.analyzedInstructions[0].steps.map((instruction) =>{
    return {
        step: instruction.number,
        instruction: instruction.step
    }   
    }));
    return instructions;
}

async function recipeInfo(recipes_id_list){
    let info_array = await getRecipesInfo(recipes_id_list);
    console.log("info array:" , info_array);
    return info_array;
}

exports.searchForRecipes = searchForRecipes;
exports.extractQueriesParams = extractQueriesParams;
exports.randomRecipes = randomRecipes;
exports.previewRecipeById = previewRecipeById;
exports.showRecipeById = showRecipeById;
exports.recipeInfo = recipeInfo;
