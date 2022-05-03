const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId



const blogSchema = new mongoose.Schema({

    title: { type: String, required:'Blog title is required',trim:true },

    body: { type: String, required:'Blog body is required',trim:true },

    authorId: { type: ObjectId,require:'authorId is required',trim:true , ref: "author" },

    tags: [{ type: String,trim:true }],

    category: { type: String, required:'Blog category is required',trim:true  },

    subcategory: [{ type: String,trim:true }],

    isPublished: { type: Boolean, default: false },

    publishedAt: { type: Date ,default:null},

    isDeleted: { type: Boolean, default: false },

    deletedAt: { type: Date,default:null }

}, { timestamps: true })

module.exports = mongoose.model("Blog", blogSchema);