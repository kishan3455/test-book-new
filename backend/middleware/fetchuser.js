var jwt = require("jsonwebtoken");
const JWT_SECRET = "Kishanisagoodb$oy";
const fetchuser = (req, res, next) => {
  //get user from the jwt  token and add id to req
  const token = req.headers["auth-token"];
  if (!token) {
    res.status(401).send({ error: "please provide token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
};

module.exports = fetchuser;
