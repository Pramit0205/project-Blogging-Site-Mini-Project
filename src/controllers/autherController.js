
const autherModel = require("../Model/authorModel")


//1.### Author APIs /authors


const createAuther = async function (req, res) {
    try {
        const data = req.body
        const result = await autherModel.create(data)
        res.status(200).send({ data: result, status: true })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ msg: error.message });
    }
}


module.exports.createAuther = createAuther 