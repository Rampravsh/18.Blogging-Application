const Blog = require("../models/blog");

/**
 * Handles the creation of a new blog post.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
async function handleAddBlog(req, res) {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      coverImageURL: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error creating blog post:", error);
    // Render an error page or redirect with an error message
    return res.status(500).render("addBlog", { 
      error: "All fields are mandatory.",
      user: req.user 
    });
  }
}

module.exports = {
  handleAddBlog,
};