const { client } = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.loggingIn = async (req, res) => {
  try {
    const checkEmail = `INSERT INTO member_info (email)
    VALUES ('${req.body.email}')
    ON CONFLICT (email) DO NOTHING;`;
    const isMember = await client.query(checkEmail);

    // user checking from database

    // if user login is successfull then

    let token = null;
    console.log("ISMEMBER", isMember.rowCount);
    if (isMember.rowCount === 1 || isMember.rowCount === 0) {
      token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      console.log(req.body.email);

      // three argument variable it will receive, 1. payload (user related information) 2. jwt_secret variable value 3. token expire value
    }
    console.log(isMember);
    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        // when we will receive this json data from broswer then browser will receive string formate data now js objecdt because we know json formate is string formate. we can convert this respose fron frontend site using parse method
        isMember: isMember.rowCount,
        token: token,
        email: req.body.email,
      });
  } catch (error) {
    console.log(error);
  }
};

// function authenticate(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split("")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.email = email;
//     next();
//   });
// }

//***jwt  (json web token)

// ***protect middleware function

module.exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //*** */ []
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json("you are not looged in! please login to get access"); // req and res cycle will be stop here
  }
  //*** */ verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET); // jwt.ion
  console.log("decode", decoded);

  // ***user is exis in database
  const check_user_query = `SELECT * from member_info WHERE email = '${decoded.email}'`;
  const isUser = await client.query(check_user_query);
  if (!check_user_query) {
    return res.status(404).json({
      message: "User is not found from database",
    });
  }

  //*** */ if user chaged password after the token was issued then we can send a error message from here
  console.log(isUser);
  req.user = {
    email: decoded.email,
  };

  return next();
};
module.exports.autoLogin = async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //*** */ []
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json("you are not looged in! please login to get access"); // req and res cycle will be stop here
  }
  //*** */ verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET); // jwt.ion
  console.log("decode", decoded);

  // ***user is exis in database
  const check_user_query = `SELECT * from member_info WHERE email = '${decoded.email}'`;
  const isUser = await client.query(check_user_query);
  if (!check_user_query) {
    return res.status(404).json({
      message: "User is not found from database",
    });
  }

  //*** */ if user chaged password after the token was issued then we can send a error message from here
  console.log(isUser.rows[0]);
  res.status(200).send(isUser.rows[0]);
};

module.exports.userInformation = async (req, res) => {
  console.log("userInformation ");
  console.log(req.user);
  if (req.user) {
    return res.status(200).json({
      message: "User is found",
    });
  } else {
    return res.status(401).json({
      message: "Your are not permited for this action",
    });
  }
};

//deletes all the plans under a user. activated from settings page
module.exports.deleteAllPlans = async (req, res) => {
  console.log(req.params.email);
  try {
    const removeData = `DELETE FROM fitness_task WHERE email ='${req.params.email}'`;
    await client.query(removeData);
    res.status(200).json({
      message: "Data Deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

//deletes all the data under a user. activated from settings page
module.exports.deleteAccount = async (req, res) => {
  console.log(req.params.email);
  try {
    const removeData = `DELETE FROM member_info WHERE email ='${req.params.email}'`;
    await client.query(removeData);
    res.status(200).json({
      message: "Data Deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addName = async (req, res) => {
  // try {
  //   console.log(req);
  //   res.send(req);
  // } catch (error) {
  //   console.log(error);
  // }
  console.log(req.body);
  if ((req.body.firstName.length > 0) & (req.body.lastName.length > 0)) {
    try {
      const insertName = `UPDATE member_info SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}' WHERE email = '${req.body.email}'`;
      const response = await client.query(insertName);
      res.send(response);
    } catch (error) {
      console.log(error);
    }
  } else if ((req.body.firstName.length < 1) & (req.body.lastName.length > 0)) {
    try {
      const insertName = `UPDATE member_info SET last_name = '${req.body.lastName}' WHERE email = '${req.body.email}'`;
      const response = await client.query(insertName);
      res.send(response);
    } catch (error) {
      console.log(error);
    }
  } else if ((req.body.lastName.length < 1) & (req.body.firstName.length > 0)) {
    try {
      const insertName = `UPDATE member_info SET first_name = '${req.body.firstName}' WHERE email = '${req.body.email}'`;
      const response = await client.query(insertName);
      res.send(response);
    } catch (error) {
      console.log(error);
    }
  }
};

//NEED TO BE ABLE TO ADD FIRST NAME AND LAST NAME OF THE USER
