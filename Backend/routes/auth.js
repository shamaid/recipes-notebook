

var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if(users.length>0){
      if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    }
    // add the new username
    let user_data =req.body;
    let hash_password = bcrypt.hashSync(
      user_data.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES(default,'${user_data.username}','${hash_password}','${user_data.firstname}',
      '${user_data.lastname}','${user_data.country}','${user_data.email}','${user_data.image}')`);
      res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    // Set cookie
    req.session.user_id = user.user_id;
    // req.session.save();
    // res.cookie(session_options.cookieName, user.user_id, cookies_options);
    // return cookie

    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});


// router.post("/Logout", function (req, res) {
//   req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
//   res.send({ success: true, message: "logout succeeded" });
// });


// async function createNewUser(user_data){
//   try{
//     const users = await DButils.execQuery("SELECT username FROM users");
//     if (users.find((x) => x.username === user_data.username))
//       throw { status: 409, message: "Username taken" };
//     // add the new username
//     let hash_password = bcrypt.hashSync(
//       user_data.password,
//       parseInt(process.env.bcrypt_saltRounds)
//     );
//     await DButils.execQuery(
//       `INSERT INTO users VALUES (default, '${user_data.username}','${hash_password}','${user_data.firstname}',
//       '${user_data.lastname}','${user_data.country}','${user_data.email}','${user_data.image})' `);
//   }catch (error) {
//     next(error);
//   }
// };

module.exports = router;
