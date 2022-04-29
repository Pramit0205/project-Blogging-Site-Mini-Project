const express = require('express');
const router = express.Router()
const AuthorController = require("../controllers/authorController")

const blogsController = require("../controllers/blogController")

const middleware= require("../middleware/middleware")

// const BlogsController= require("../controllers/blogsController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/createAuther', AuthorController.createAuther)

router.post("/createBlog", blogsController.createBlog)

router.post("/loginUser",AuthorController.loginUser)

router.get('/getBlog',middleware.validateToken,blogsController.getBlog)

router.put('/blogs/:blogId',middleware.validateToken,blogsController.updateblog)

router.delete('/blogs/:blogId',middleware.validateToken,blogsController.deleteBlog)

router.delete('/blogs', middleware.validateToken,blogsController.deleteBlogBy)




module.exports = router;