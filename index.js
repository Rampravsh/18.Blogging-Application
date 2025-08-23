// Import necessary core modules
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Import custom modules: routes, middleware, and database connection
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthentication } = require("./middlewares/auth");
const { connectMongoDB } = require("./config/connect");
const Blog = require("./models/blog");

// Load environment variables from the .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware Setup ---
// Serve static files from the "public" directory
app.use(express.static(path.resolve("./public")));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse cookies from incoming requests
app.use(cookieParser());
// Custom middleware to check for user authentication on all routes
app.use(checkForAuthentication());

// --- View Engine Setup ---
// Set EJS as the templating engine
app.set("view engine", "ejs");
// Specify the directory where the view templates are located
app.set("views", path.resolve("./views"));

// --- Route Handling ---
// Mount the user and blog routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Home page route: displays blogs based on user role
app.get("/", async (req, res) => {
  try {
    // If the user is not logged in, render the home page with no blogs
    if (!req.user) {
      return res.render("home", { user: null, blogs: [] });
    }

    // Admins can see all blogs, regular users only see their own
    const query = req.user.role === "ADMIN" ? {} : { createdBy: req.user._id };
    const blogs = await Blog.find(query);

    // Render the home page with the user's information and their blogs
    res.render("home", {
      user: req.user,
      blogs: blogs,
    });
  } catch (error) {
    // Log any errors that occur during blog fetching
    console.error("Error fetching blogs:", error);
    // Render a 404 page in case of an error
    res.status(404).render("404", { user: req.user });
  }
});

// Favicon route: prevents unnecessary 404 errors for the browser's favicon requests
app.get("/favicon.ico", (req, res) => {
  // Return a 204 No Content response, as we are not providing a favicon
  return res.status(204).send();
});

// --- Database Connection and Server Startup ---
// Connect to MongoDB using the URI from environment variables
connectMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected!");
    // Start the Express server only after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Log any errors that occur during the MongoDB connection process
    console.error("MongoDB connection error:", err);
  });
