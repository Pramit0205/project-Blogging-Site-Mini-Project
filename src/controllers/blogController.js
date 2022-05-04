const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId 
const autherModel = require("../Model/authorModel")
//const blogModel = require("../Model/blogModel")
const blogsModel = require("../Model/blogModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
  }

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//2.### POST /blogs


const createBlog = async function (req, res) {
    try {
        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            res.status(400).send({status:false , message:'Invalid request parameters. please provide blog details'})
            return
        }

        //extract params
        const{title, body ,authorId, tags, category, subcategory, isPublished} = requestBody; 

        //validation starts 
        if(!isValid(title)){
            res.status(400).send({status:false , message:'Blog title is required'})
            return 
        }

        if(!isValid(body)){
            res.status(400).send({status:false , message:'blog body  is required'})
            return 
        }

        if(!isValid(authorId)){
            res.status(400).send({status:false , message:'author id  is required'})
            return 
        }

        if(!isValidObjectId(authorId)){
            res.status(400).send({status:false , message:'${authorId}is not a valid author id '})
            return 
        }

        if(!isValid(category)){
            res.status(400).send({status:false , message:'Blog category is required'})
            return 
        }

        const author = await autherModel.findById(authorId)


        if (!author){
             res.status(400).send({ status: false, msg: "Author does not exist" })
            return
        }
         //validation ends 
         const blogData = {
             title ,
             body , 
             authorId ,
             category ,
             isPublished: isPublished ? isPublished : false ,
             publishedAt: isPublished ? new Date() : null 
         }


         if(tags) {
         if(Array.isArray(tags)){
            blogData['tags'] = [ ...tags]
         }
         if(Object.prototype.toString.call(tags) === "[object String]") {
             blogData['tags'] = [ tags ]
         }
        }

        if(subcategory) {
            if(Array.isArray(subcategory)){
               blogData['subcategory'] = [ ...subcategory]
            }
            if(Object.prototype.toString.call(subcategory) === "[object String]") {
                blogData['subcategory'] = [ subcategory ]
            }
           }

        const newBlog = await blogsModel.create(blogData)

        res.status(201).send({ status: true, message:'New Blog created successflly' , data : newBlog })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}





//3.### GET /blogs

const listBlog = async function (req, res) {
    try {
        const filterQuery = { isDeleted : false , deletedAt: null , isPublished: true}
        const queryParams = req.query
   
        if(isValidRequestBody(queryParams)) {
            const {authorId, category , tags , subcategory} = queryParams

            if(isValid(authorId) && isValidObjectId(authorId)){
                filterQuery['authorId'] = authorId
            }
            if(isValid(category)){
                filterQuery['category'] = category.trim()
            }
            if(isValid(tags)){
                const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                filterQuery['tags'] = { $all:tagsArr}
            }
            if(isValid(subcategory)){
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['tags'] = { $all:subcatArr}
            }
        }

        const Blogs = await blogsModel.find(filterQuery)
        if(Array.isArray(Blogs) && Blogs.length === 0){
            res.status(404).send({ status: false, msg: "no blogs found" })
            return 
        }
        res.status(200).send({ status: true, message:'Blogs list' , data:Blogs })
        }
    catch (error) {
        res.status(500).send({  status: false , message: error.message });
    }
}





//4.### PUT /blogs/:blogId



const updateblog = async function (req, res) {
    try {
        const requestBody = req.body 
        const params = req.params 
        const blogId = params.blogId 
        const authorIdFromToken = req.query.authorId 
        console.log(authorIdFromToken)

        // validation starts 
        if(!isValidObjectId(blogId)){
            res.status(400).send({status:false , message:'${blogId} is not a valid blog id '})
            return 
        }
        if(!isValidObjectId(authorIdFromToken)){
            console.log(isValidObjectID(authorIdFromToken))
            res.status(400).send({status:false , message:`${authorIdFromToken} is not a valid token id `})
            return 
        }
        
        const blog = await blogsModel.findOne({_id: blogId , isdeleted : false , deletedAt : null})

        if(!blog){
            res.status(404).send({ status: false, message: 'blog does not found '})
            return
        }
        if(blog.authorId.toString() !== authorIdFromToken){
            res.status(404).send({ status: false, message: 'Unathorized access! Owner info Does not match'})
            return
        }
        if( !isValidRequestBody(requestBody)){
            res.status(200).send({ status: true, message: 'No parameters passed. Blog unModified' , data:blog})
            return
        } 

        // extract params
        const {title, body ,tags , category , subcategory , isPublished} = requestBody ;
        
        const updateBlogData = {}
        
        if(isValid(title)){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}

            updateBlogData['$set']['title'] = title
        }
        if(isValid(body)){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}

            updateBlogData['$set']['body'] = body
        }
        if(isValid(category)){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}

            updateBlogData['$set']['category'] = category
        }
        if(isPublished !== undefined){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}

            updateBlogData['$set']['isPublished'] = isPublished
            updateBlogData['$set']['publishedAt'] = isPublished ? new Date(): null 
        }
        if(tags){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$addToSet')) updateBlogData['$addToSet'] = {}
            if(Array.isArray(tags)){
                updateBlogData['$addToSet']['tags'] = {$each: [...tags]}
            }
            if(typeof tags === "string") {
                updateBlogData['$addToSet']['tags'] = tags
            }
        }if(subcategory){
            if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$addToSet')) updateBlogData['$addToSet'] = {}
            if(Array.isArray(subcategory)){
                updateBlogData['$addToSet']['subcategory'] = {$each: [...subcategory]}
            }
            if(typeof subcategory === "string") {
                updateBlogData['$addToSet']['subcategory'] = subcategory
            }
        }

        const updateblog = await blogsModel.findOneAndUpdate({ _id: blogId }, updateBlogData, { new: true });
        res.status(200).send({ status: true, message:"blog updated successfully" ,  data: updateblog });
    }
    catch (error) {
        console.log("this is the error:", error.message)
        res.status(500).send({ status: false, error: error.message })
    }

}






//5.### DELETE /blogs/:blogId


const deleteBlog = async function (req, res) {
    try {
        
        const requestBody = req.body 
        const params = req.params 
        const blogId = params.blogId 
        const authorIdFromToken = req.query.authorId 

        // validation starts 
        if(!isValidObjectId(blogId)){
            res.status(400).send({status:false , message:'${blogId} is not a valid blog id '})
            return 
        }
        if(!isValidObjectId(authorIdFromToken)){
            res.status(400).send({status:false , message:'${authorIdFromToken} is not a valid token id '})
            return 
        }
        const blog = await blogsModel.findOne({_id: blogId , isDeleted : false , deletedAt : null})

        if(!blog){
            res.status(404).send({ status: false, message: 'blog does not found '})
            return
        }
        if(blog.authorId.toString() !== authorIdFromToken){
            res.status(404).send({ status: false, message: 'Unathorized access! Owner info Does not match'})
            return
        }
        

    await blogsModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() },new: true })

        res.status(200).send({ status: true, msg: 'Blog deleted succesfully' })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}






//6.### DELETE /blogs?queryParams

const deleteBlogByParams = async function (req, res) {

    try {
        const filterQuery = { isDeleted: false, deletedAt: null }
        const queryParams = req.query
        const authorIdFromToken = req.authorId

        if (!isValidRequestBody(queryParams)) return res.status(400).send({ status: false, msg: 'give data in query params' })

        const { authorId, category, tags, subcategory, isPublished } = queryParams

        if (isValid(authorId) && isValidObjectId(authorId)) {
            filterQuery['authorId'] = authorId
        }
        if (isValid(category)) {
            filterQuery['category'] = category.trim()
        }
        if (isValid(isPublished)) {
            filterQuery['isPublished'] = isPublished
        }
        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            filterQuery['tags'] = { $all: tagsArr }
        }
        if (isValid(subcategory)) {
            const subcategoryArr = subcategory.trim().split(',').map(subcategory => subcategory.trim());
            filterQuery['subcategory'] = { $all: subcategoryArr }
        }

        const blogs = await blogsModel.find(filterQuery);
        if (Array.isArray(blogs) && blogs.length === 0) {
            return res.status(404).send({ status: false, msg: 'no blog found' })
        }
        const idsOfBlogsToDelete = blogs.map(blog => {
            if (blog.authorId.toString() === authorIdFromToken) return blog.id
        })
        if (idsOfBlogsToDelete.length === 0) {
            return res.status(404).send({ status: false, msg: 'no blog found' })
        }

        await blogsModel.updateMany({ _id: { $in: idsOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, msg: 'blog deleted successfully' })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }



}


module.exports.createBlog = createBlog
module.exports.listBlog = listBlog
module.exports.updateblog = updateblog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByParams = deleteBlogByParams