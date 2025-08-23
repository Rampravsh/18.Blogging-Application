const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    // Title of the blog post
    title: {
      type: String,
      required: true,
    },
    // Body of the blog post
    body: {
      type: String,
      required: true,
    },
    // URL of the cover image
    coverImageURL: {
      type: String,
      required: false,
    },
    // User who created the blog post
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;