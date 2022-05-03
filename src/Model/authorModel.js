
//{ fname: { mandatory}, lname: {mandatory},
// title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }



const mongoose = require('mongoose');


const autherSchema = new mongoose.Schema({

    fName: { type: String, required:'fname is required',trim:true},

    lName: { type: String, required:'lname is required',trim:true },

    title: { type: String, required:'title is required', enum: ["Mr", "Mrs", "Miss"] },

    email: { type: String, required:'email is required',lowercase:true, unique: true,trim:true,
     match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g },

    password: { type: String, required:'password is required',trim:true }

}, { timestamps: true });


module.exports = mongoose.model('author', autherSchema)