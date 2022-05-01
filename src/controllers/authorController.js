
const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");


//1.### Author APIs /authors


const createAuther = async function (req, res) {
  try {
    const data = req.body

    if (!data.firstName) return res.status(400).send({ status: false, msg: " firstName is not present" })

    if (!data.lastName) return res.status(400).send({ status: false, msg: " lastName is not present" })

    if (!data.title) return res.status(400).send({ status: false, msg: " title is not present" })

    if (!data.email) return res.status(400).send({ status: false, msg: " email is not present" })

    if (!data.password) return res.status(400).send({ status: false, msg: " password is not present" })

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
  try {
    let userName = req.body.emailId;
    let password = req.body.password;

    if (!userName) return res.status(400).send({ status: false, msg: "please enter the emailId" })

    if (!password) return res.status(400).send({ status: false, msg: "please enter the password" })

    let author = await authorModel.findOne({ emailId: userName, password: password });

    if (!author) return res.status(400).send({ status: false, msg: "username or the password is not correct" });

    let token = jwt.sign(
      {
        autherId: author._id.toString(),
        batch: "uranium",
        organisation: "FUnctionUp",
      },
      "functionup-uranium"
    );

    res.status(200).send({ status: true, data: token });
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({ msg: error.message });
  }

};

module.exports.createAuther = createAuther

module.exports.loginUser = loginUser