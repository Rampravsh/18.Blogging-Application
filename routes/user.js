const { Router } = require("express");
const { handleUserLogin, handleUserSignup } = require("../controllers/user");

const router = Router();

// Render the login page
router.get("/login", (req, res) => {
  return res.render("login");
});

// Render the signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Handle user login
router.post("/login", handleUserLogin);

// Handle user signup
router.post("/signup", handleUserSignup);

// Handle user logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;