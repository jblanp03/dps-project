const userController = require("../controllers/user.controller");

const { verifySignUp, authJwt } = require("../controllers/authMiddleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    '/api/users',
    // [authJwt.verifyToken],
    userController.findAll
  );

  app.delete('/api/users/:id', 
    [
      // verifySignUp.isAdmin, 
      // authJwt.verifyToken
    ], 
    userController.delete
  )
};
