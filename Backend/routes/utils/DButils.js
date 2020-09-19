require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.tedious_userName,
  password: process.env.tedious_password,
  server: process.env.tedious_server,
  database: process.env.tedious_database,
  // connectionTimeout: 1500000,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool
  .connect()
  .then(() => console.log("new connection pool Created"))
  .catch((err) => console.log(err));

async function execQuery(query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

execQuery().catch((error) => console.log(`Error in executing ${error}`));

// process.on("SIGINT", function () {
//   if (pool) {
//     pool.close(() => console.log("connection pool closed"));
//   }
//   process.exit();
// });

// =============== Queries ===============

async function cheekUserIDinDB(user_id){
  let db_answer = await execQuery("select * from users where user_id = '"+user_id+"'");
  return db_answer;
}


async function getUserInfoOnRecipes(user_id,recipe_ids){
  let db_answer = await execQuery("select recipe_id,saved from dbo.view_saved where user_id ='"+user_id+"' and recipe_id in ("+recipe_ids+")");
  return db_answer;
}

//New 
async function insertNewRecipeView(user_id,recipe_id){
  let db_answer = await execQuery("INSERT INTO dbo.view_saved values ("+recipe_id +",'"+user_id+"'"+"," + "0, CURRENT_TIMESTAMP)");
  return db_answer;
}
 
async function updateNewRecipeView(user_id,recipe_id){
  await execQuery("UPDATE dbo.view_saved set time = CURRENT_TIMESTAMP where recipe_id = " +recipe_id +" and user_id = '" + user_id +"'");
  
}

async function likeRecipe(user_id,recipe_id){
  let db_answer = await execQuery("UPDATE dbo.view_saved set saved = 1 where recipe_id = " +recipe_id +" and user_id = '" + user_id +"'");
  return db_answer;
}

//Not Implemnted
async function dislikeRecipe(user_id,recipe_id){
  let db_answer = await execQuery("UPDATE dbo.view_saved set saved = 0 where recipe_id = " +recipe_id +" and user_id = '" + user_id +"'");
  return db_answer;
}

async function getLastThreeView(user_id){
  let db_answer = await execQuery("SELECT top (3) recipe_id,time from view_saved where user_id = '" + user_id + "' order by time desc");
  return db_answer;
}

//Not Implemnted
async function getLastNumView(user_id,recipe_id, num_of_recipe){
  let db_answer = await execQuery("select recipe_id,saved from dbo.view_saved where user_id ='"+user_id+"' and recipeid in ("+ids+")");
  return db_answer;
}

//Not used
async function insertUserRecipe(user_id,recipe_id,details,instructions){
  let db_answer = await execQuery("INSERT INTO dbo.recipes values ('"+recipe_id +"','"+user_id+ "','" +details+"','"+instructions+"'");
  return db_answer;
}

async function getUserRecipe(user_id,recipe_id){
  let db_answer = await execQuery("select *  from dbo.recipes where user_id ='"+user_id+"' and recipe_id ='"+recipe_id+"'");
  return db_answer;
}

async function getAllUserRecipes(user_id){
  let db_answer = await execQuery("select *  from dbo.recipes where user_id ='"+user_id+"'");
  return db_answer;
}

//Not Implemnted
async function insertUserRecipeInstructions(user_id,recipe_id, num_of_recipe){
  let db_answer = await execQuery("select recipe_id,saved from dbo.view_saved where user_id ='"+user_id+"' and recipeid in ("+ids+")");
  return db_answer;
}
//Not Implemnted
async function getUserRecipeInstructions(user_id,recipe_id, num_of_recipe){
  let db_answer = await execQuery("select recipe_id,saved from dbo.view_saved where user_id ='"+user_id+"' and recipeid in ("+ids+")");
  return db_answer;
}

//Not used
async function insertUserFamilyRecipe(user_id,recipe_id,details){
  let db_answer = await execQuery("INSERT INTO family_recipes values ('"+recipe_id +"','"+user_id+ "','" +details+"'");
  return db_answer;
}

async function getUserFamilyRecipe(user_id,recipe_id){
  let db_answer = await execQuery("select * from family_recipes where user_id = '"+user_id+"' and recipe_id like '"+recipe_id+"'");
  return db_answer;
}

async function getAllUsersFamilyRecipes(user_id){
  let db_answer = await execQuery("select * from family_recipes where user_id = '"+user_id+"'");
  return db_answer;

}

async function getAllSaved(user_id){
  let db_answer = await execQuery("select recipe_id from dbo.view_saved where user_id = '" + user_id +"'" + " and saved = 1 ");
  return db_answer;
}

async function getUserPorfilePicture(user_id){
  let db_answer = await execQuery("select image from dbo.users where user_id = '" + user_id +"'");
  return db_answer;
}


// =============== Export ===============

module.exports ={
  execQuery: execQuery,
  cheekUserIDinDB: cheekUserIDinDB,
  getUserInfoOnRecipes :getUserInfoOnRecipes,
  insertNewRecipeView:insertNewRecipeView,
  updateNewRecipeView:updateNewRecipeView,
  likeRecipe:likeRecipe,
  getLastThreeView:getLastThreeView,
  insertUserRecipe:insertUserRecipe,
  getUserRecipe:getUserRecipe,
  getAllUserRecipes:getAllUserRecipes,
  getUserFamilyRecipe:getUserFamilyRecipe,
  getAllUsersFamilyRecipes:getAllUsersFamilyRecipes,
  getAllSaved:getAllSaved,
  getUserPorfilePicture:getUserPorfilePicture,
}