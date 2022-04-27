
const autherModel = require("../Model/authorModel")
const blogsModel = require("../Model/blogModel1")

//### POST /blogs
const createBlog = async function (req, res) {
    try {
        let data = req.body
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





//### GET /blogs

const getBlog = async function (req, res) {
    try {
        let query = req.query
        let mainQuery = [{ authorId: query.authorId }, { category: query.category }, { tags: query.tags }, { subcategory: query.subcategory }]
        let obj = { isDeleted: false, isPublished: true, $or: mainQuery }
        let getData = await blogsModel.find(obj).collation({ locale: "en", strength: 2 })

        if (!(query.authorId || query.category || query.tags || query.subcategory))
            getData = await blogsModel.find({ isDeleted: false, isPublished: true })
        if (getData.length === 0)
            return res.status(404).send({ status: false, msg: "Blogs not present" })

        res.status(200).send({ status: true, msg: getData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//### PUT /blogs/:blogId

const updateblog= async function(req ,res){
    try{
   
        let blogId = req.params.blogId;
        let blog = await blogsModel.findById(blogId);
        //Return an error if no user with the given id exists in the db
        if (!blog) {
          return res.status(400).send("No such blog exists");
        }
      
        let blogData = req.body;
        if (blogData.isPublished == true)
        blogData["publishedAt"] = new Date();
        let updateblog = await blogsModel.findOneAndUpdate({ _id: blogId }, blogData, {new: true});
        res.status(201).send({ status:true, data: updateblog });
    }catch(err) {
        console.log("this is the error:",err.message)
        res.status(500).send({msg:"error",error:err.message})
    }

}


//### DELETE /blogs/:blogId


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


//### DELETE /blogs?queryParams

const deleteBlogBy = async function (req, res) {
    try {
        let query = req.query
        let mainQuery = [{ authorId: query.authorId }, { category: query.category }, { tags: query.tags }, { subcategory: query.subcategory }]
        let obj = { isDeleted: false, isPublished: false, $or: mainQuery }
        let findData = await blogsModel.find(obj).collation({ locale: "en", strength: 2 })
        if (findData.length === 0)
            return res.status(404).send({ status: false, message: "no such blogs exists / the blogs you are looking for are already deleted or published" })
        let deletedData = await blogsModel.updateMany(obj, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true, upsert: true })
        res.status(200).send({ status: true, msg: deletedData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createBlog=createBlog
module.exports.getBlog=getBlog 
module.exports.updateblog=updateblog
module.exports.deleteBlog=deleteBlog
module.exports.deleteBlogBy=deleteBlogBy