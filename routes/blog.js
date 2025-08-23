const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const { handleAddBlog } = require("../controllers/blog");
const { checkForAuthentication } = require("../middlewares/auth");
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", checkForAuthentication(['USER', 'ADMIN']), (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", checkForAuthentication(['USER', 'ADMIN']), upload.single("coverImage"), handleAddBlog);

router.get("/:id", async (req, res) => {
    if (!req.user) return res.redirect("/user/login");
    try {
      const blog = await Blog.findById(req.params.id).populate("createdBy");
      const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
      if (!blog) {
        return res.status(404).render("404", { user: req.user });
      }
      return res.render("blog", { 
        user: req.user,
        blog,
        comments,
      });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).send("Internal Server Error");
    }
  });

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;