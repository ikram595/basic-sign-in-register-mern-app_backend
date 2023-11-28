const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("test is working");
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if name is entered
    if (!name) {
      return res.json({ error: "Name field is required" });
    }
    //check password
    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (password.length < 6) {
      return res.json({
        error: "Password should be at least 6 charachters long",
      });
    }
    //check email
    const exist = await User.findOne({ email }); //if the email is found in the schema=>email exists in the db
    if (exist) {
      return res.json({
        error: "email is already taken",
      });
    }

    const hashedPassword = await hashPassword(password);
    //create the user in the db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//login endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user existes
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "no user found " });
    }
    //check password
    if (!password) {
      return res.json({ error: "Password is required" });
    }
    //compare passwords
    const match = await comparePassword(password, user.password);

    if (match) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      res.json({ error: "Password is not correct, Please try again" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = { test, registerUser, loginUser, getProfile };
