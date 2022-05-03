const jwt = require("jsonwebtoken");



const validateToken = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) return res.status(403).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "functionup-uranium");
    console.log(decodedToken)
    if (!decodedToken)
      return res.status(403).send({ status: false, msg: "token is invalid" });


    let authorlogged = decodedToken.autherId;
    console.log(authorlogged)
    let autherDetails = req.query.authorId;
    console.log(autherDetails)
    if (autherDetails !== authorlogged)
      return res.status(404).send({ status: false, msg: "No such user exists" });
    next();

  } catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }


}

module.exports.validateToken = validateToken

