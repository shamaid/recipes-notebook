var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const userUtils = require("./utils/userUtils");


// Authentication check 
router. use(async (req, res, next)=>{
  if(req.session && req.session.user_id){
      const id = req.session.user_id;
      const user = (await DButils.cheekUserIDinDB(id));
      if(user){
          req.user = user[0];
          next();
      }
  } else{
      res.sendStatus(401);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

router.get("/recipeInfo/:ids", async (req, res,next) => {
  userUtils
  .recipeInfo(req)
  .then((info_array) => res.send(info_array))
  .catch((error) => {
    console.log(error);
    //res.send(error);
    res.sendStatus(404);
  });
});


router.get("/viewRecipe/:id", async (req, res,next) => {
  userUtils
  .viewRecipe(req)
  .then((info_array) => res.send(info_array))
  .catch((error) => {
    console.log(error);
    //res.send(error);
    res.sendStatus(404);
  });
});


router.put("/likeRecipe/:id", async (req, res,next) => {
  userUtils
  .likeRecipe(req)
  .then((info_array) => res.send(info_array))
  .catch((error) => {
    console.log(error);
    //res.send(error);
    res.sendStatus(404);
  });
});


router.get("/lastviewed", async (req, res,next) => {
  userUtils
  .lastviewed(req,res)
  .then((info_array) =>   {
    if (info_array.length > 0)
        res.send(info_array);
    else{
      res.status(205).send({
        message: "No recipes were watched",
        success: true,
      });
    } 
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });
});


router.get("/getUserRecipe/:recipe_id", async (req, res,next) => {
  userUtils
  .getUserRecipe(req,res)
  .then((info_array) => res.send(info_array))
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });
});


router.get("/getUserAllRecipes", async (req, res,next) => {
  userUtils
  .getUserAllRecipes(req,res)
  .then((info_array) =>  {
    if (info_array){
      res.send(info_array);
    }else{
      res.status(205).send({ message: "No personal recipes", success: true });

    }
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);

  });
});


router.get("/getUserFamilyRecipe/:recipe_id", async (req, res,next) => {
  userUtils
  .getUserFamilyRecipe(req,res)
  .then((info_array) => res.send(info_array))
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });
});



router.get("/getAllUserFamilyRecipes", async (req, res,next) => {
  userUtils
  .getAllUserFamilyRecipes(req,res)
  .then((info_array) => {
    if (info_array){
      res.send(info_array);
    }else{
      res.status(205).send({ message: "No family recipes", success: true });
    }
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });
});


router.get("/getAllSaved", async (req, res,next) => {
  userUtils
  .getAllSaved(req,res)
  .then((info_array) => {
    if (info_array){
      res.send(info_array);
    }
    else {
      res.status(205).send({
        message: "No favorite recipes found",
        success: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(404);
  });
});

router.get("/getUserPorfilePicture", (req, res) => {
  userUtils
    .getUserPorfilePicture(req,res)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
      console.log(error);
      res.sendStatus(404);
    });
});

module.exports = router;
