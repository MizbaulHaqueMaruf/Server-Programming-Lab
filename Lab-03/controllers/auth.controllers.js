const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../config/passport");

const userFilePath = path.join(__dirname, "../users.json");
let users = []; // store the user info here
fs.readFile(userFilePath, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  users = JSON.parse(data);

  initializePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
  );
});

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {
  const pass = req.body.password;

  if (pass === null) {
    console.log("No password");
    return;
  }

  if (pass.length < 8) {
    console.log("Password should be at least 8 characters long.");
    return;
  }

  // Define a function to check if a string contains at least one digit
  const containsDigit = (str) => {
    return /\d/.test(str);
  };

  // Define a function to check if a string contains at least one special character
  const containsSpecialCharacter = (str) => {
    const specialChars = /[$@$!%*?&]/;
    return specialChars.test(str);
  };

  if (!containsDigit(pass) || !containsSpecialCharacter(pass)) {
    console.log(
      "Password should include at least one digit and one special character."
    );
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // req.body.password ==> password should be exact match to register.html name=password,  10:how many time you want to generate hash. it's a standard default value
    users.push({
      id: Date.now().toString(),
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const filepath = path.join(__dirname, "../users.json");
    fs.writeFile(filepath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users); // show the user list
};
module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
};
