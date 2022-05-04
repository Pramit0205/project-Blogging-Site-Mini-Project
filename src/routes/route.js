const express = require('express');
const router = express.Router()
const AuthorController = require("../controllers/authorController")

const blogsController = require("../controllers/blogController")

const middleware = require("../middleware/middleware")




router.post('/createAuthor', AuthorController.createAuthor)

router.post("/loginUser", AuthorController.loginAuthor)


router.post("/createBlog", middleware.validateToken, blogsController.createBlog)

router.get('/getBlog', middleware.validateToken, blogsController.listBlog)

router.put('/blogs/:blogId', middleware.validateToken, blogsController.updateblog)

router.delete('/blogs/:blogId', middleware.validateToken, blogsController.deleteBlog)

router.delete('/blogs', middleware.validateToken, blogsController.deleteBlogByParams)




module.exports = router;