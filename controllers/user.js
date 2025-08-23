const User = require("../models/user");
const { generateToken } = require("../services/authentication");

/**
 * Handles user signup.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
async function handleUserSignup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
    });
    return res.redirect("/user/login");
  } catch (error) {
    return res.render("signup", {
      error: "Failed to create user. Email might already be in use.",
    });
  }
}

/**
 * Handles user login.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.matchPassword(email, password);
    const token = generateToken(user);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password.",
    });
  }
}

module.exports = {
  handleUserLogin,
  handleUserSignup,
};