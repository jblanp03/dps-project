const { verifySignUp, authJwt } = require("../controllers/authMiddleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

/***** new user register *******/
  app.post( "/api/createAccount",
    [
      // verifySignUp.checkDuplicateUsername,
      // verifySignUp.checkMandatoryFields,
      // verifySignUp.isAdmin
    ], controller.createAccount
  );

/****** user login *******/
  app.post("/api/logIn", controller.logIn);

/****** Token KeepAlive *******/
  app.post("/api/keepalive", 
    [authJwt.verifyToken, authJwt.verifySession], controller.refreshlogIn);

};