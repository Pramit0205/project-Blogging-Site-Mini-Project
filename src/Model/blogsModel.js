const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

//{ title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string},
 //category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]},
  //subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, 
  //createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false},
  // publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}

const BlogsSchema = new mongoose.Schema({
   title:{type:String ,required:true },
   body:{type:String ,required:true },
   autherId:{ type:ObjectId  ,ref:'auther' ,required:true  },
     tags :{type:[String]  } ,
     category :{ type:String , required: true },
     subcategory:{type:[String] },
     isDeleted:{type:Boolean , default:false},
    // publishedAt:{}
    //deletedAt:
    isPublished:{type:Boolean , default:false},



}, { timestamps: true });


module.exports= mongoose.model('Blogs' , BlogsSchema )