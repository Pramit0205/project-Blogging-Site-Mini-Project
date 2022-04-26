const express = require('express');
const router = express.Router()
const AutherController= require("../controllers/autherController")
const BlogsController= require("../controllers/blogsController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/createAuther' , AutherController.createAuther)




module.exports = router;