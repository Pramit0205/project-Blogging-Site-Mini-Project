
const autherModel = require("../Model/authorModel")
const blogModel = require("../Model/blogModel")
const blogsModel = require("../Model/blogModel")



//2.### POST /blogs


const createBlog = async function (req, res) {
    try {
        let data = req.body

        if (!data.authorId) return res.status(400).send({ status: false, msg: "please, enter the autherId" })

        if (!data.title) return res.status(400).send({ status: false, msg: "please, enter the title" })

        if (!data.body) return res.status(400).send({ status: false, msg: "please, enter the body" })

        if (!data.category) return res.status(400).send({ status: false, msg: "please, enter the category" })

        let authorData = await autherModel.findById(data.authorId)


        if (!authorData)
            return res.status(400).send({ status: false, msg: "Enter valid author ID" })

        if (data.isPublished)
            data["publishedAt"] = new Date();

        const createdBlog = await blogsModel.create(data)

        res.status(200).send({ status: true, msg: createdBlog })
    }
    catch (error) {
        res.status(400).send({ status: false, msg: error.message })
    }
}





//3.### GET /blogs

const getBlog = async function (req, res) {
    try {

        let body = req.query
        body.isDeleted = false
        body.isPublished = true

        let result = await blogsModel.find(body)
        if (!result) {
            res.status(404).send({ status: false, msg: "no such a blog exist" })
            return;
        }
        res.status(200).send({ status: true, data: result })



    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
    }
}





//4.### PUT /blogs/:blogId



const updateblog = async function (req, res) {
    try {

        let blogId = req.params.blogId;

        let blog = await blogsModel.findById(blogId);

        if (!blog) {
            return res.status(400).send("No such blog exists");
        }

        let blogData = req.body;

        if (blogData.isPublished == true)
            blogData["publishedAt"] = new Date();

        let updateblog = await blogsModel.findOneAndUpdate({ _id: blogId }, blogData, { new: true });
        res.status(201).send({ status: true, data: updateblog });
    }
    catch (err) {
        console.log("this is the error:", err.message)
        res.status(500).send({ msg: "error", error: err.message })
    }

}






//5.### DELETE /blogs/:blogId


const deleteBlog = async function (req, res) {
    try {
        let Blogid = req.params.blogId
        let findData = await blogsModel.findById(Blogid)

        if (!findData)
            return res.status(404).send({ status: false, message: "no such blog exists" })

        if (findData.isDeleted)
            return res.status(400).send({ status: false, msg: "Blog is already deleted" })

        let deletedata = await blogsModel.findOneAndUpdate({ _id: Blogid }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true, upsert: true })

        res.status(200).send({ status: true, msg: deletedata })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}





//6.### DELETE /blogs?queryParams

const deleteBlogBy = async function (req, res) {
    try {

        let body = req.query
        body.isDeleted = false

        let auth2 = req.auth1
        console.log(auth2);

        let result = await blogsModel.updateMany(body, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true, upsert: true })

        res.status(200).send({ status: true, data: result })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateblog = updateblog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogBy = deleteBlogBy