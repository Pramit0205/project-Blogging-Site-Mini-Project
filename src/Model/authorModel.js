
//{ fname: { mandatory}, lname: {mandatory},
// title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }



const mongoose = require('mongoose');


const autherSchema = new mongoose.Schema({

    fName: { type: String, required:true,trim:true},

    lName: { type: String, required:true,trim:true },

    title: { type: String, required:true, enum: ["Mr", "Mrs", "Miss"] },

    email: { 
        type: String, required:true,lowercase:true, unique: true,trim:true,
            validate:{
                validator:function(email){
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                },msg:'please fill a valid email address',isAsync:false
            }

            },

    password: { type: String, required:true,trim:true }

}, { timestamps: true });


module.exports = mongoose.model('author', autherSchema)