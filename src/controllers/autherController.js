 
 const autherModel = require("../Model/autherModel")
 const validator = require("validator");

 const createAuther = async function(req ,res){
     try{ 
    const data = req.body
    validator.isEmail('foo@bar.com'); //=> true
     const result = await autherModel.create(data)
     res.status(200).send({data:result , status: true})
     }
     catch(error){
         console.log(error.message)
         res.status(500).send({msg:error.message});
     }
 }


 module.exports.createAuther = createAuther 