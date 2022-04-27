const express = require('express');
const router = express.Router()
const AutherController= require("../controllers/autherController")

const blogsController=require("../controllers/blogController")

// const BlogsController= require("../controllers/blogsController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/createAuther' , AutherController.createAuther)

router.post("/createBlog" ,  blogsController.createBlog)

router.get('/getBlog',blogsController.getBlog)

router.put('/blogs/:blogId',blogsController.updateblog)

router.delete('/blogs/:blogId',blogsController.deleteBlog)

router.delete('/blogs',blogsController.deleteBlogBy)

// router.delete('/blogsdelete',blogsController.blogsdelete)


module.exports = router;