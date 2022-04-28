
const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");


//1.### Author APIs /authors


const createAuther = async function (req, res) {
    try {
        const data = req.body
        const result = await authorModel.create(data)
        res.status(200).send({ data: result, status: true })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ msg: error.message });
    }
}

//### POST /login
const loginUser = async function (req, res) {
    let userName = req.body.emailId;
    let password = req.body.password;
  
    let author = await authorModel.findOne({ emailId: userName, password: password });
    if (!author)
      return res.send({
        status: false,
        msg: "username or the password is not correct",
      });
      let token = jwt.sign(
        {
          autherId: author._id.toString(),
          batch: "uranium",
          organisation: "FUnctionUp",
        },
        "functionup-uranium"
      );
      //res.setHeader("x-auth-token", token);
      res.send({ status: true, data: token });
    };

module.exports.createAuther = createAuther 
module.exports.loginUser=loginUser