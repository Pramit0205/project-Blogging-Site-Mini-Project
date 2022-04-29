const jwt = require("jsonwebtoken");



const validateToken= function (req, res, next) {
    try {
        let token = req.headers["x-Auth-token"];
        if (!token) token = req.headers["x-auth-token"];
        if (!token) return res.send({ status: false, msg: "token must be present" });
        console.log(token);
        let decodedToken = jwt.verify(token, "functionup-uranium");
    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });

      let authorlogged =decodedToken.authorId;
      let autherDetails = req.query.authorId;
       if (autherDetails !== authorlogged)
      return res.status(404).send({ status: false, msg: "No such user exists" });
      next();
    } catch(err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
      }
       
    
}

module.exports.validateToken = validateToken