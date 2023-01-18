const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided! (closed session)",
      message_es: "No se ha encontrado token de seguridad (sesion no iniciada)"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        message_es: "Acceso no Autorizado"
      });
    }
    req.username = decoded.id;
    req.sessionId = decoded.subject;
    console.log('token verified', req.username)
    next();
  });
};

verifySession = (req, res, next) => {
  console.log("session keepalive", req.username, req.sessionId);
  //TODO: implement session control check session in db, ignore session in body, etc...
  if (req.body.sessionId!=req.sessionId){
    return res.status(401).send({
      message: "Session Expired!",
      message_es: "Acceso no Autorizado, Sesión finalizada"
    });
  }
  else{
    next();
  }
};


const authJwt = {
  verifyToken: verifyToken,
  verifySession: verifySession,
};
module.exports = authJwt;