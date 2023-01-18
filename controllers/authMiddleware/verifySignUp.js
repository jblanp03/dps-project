const db = require("../../models");
const User = db.user;

checkMandatoryFields = (req, res, next) => {
  if (!!req.body.username && !!req.body.password){
    next();
  }else{
    res.status(400).send({
      isOk: false,
      message: "Failed! username and password are required",
      message_es: "error: es necesario especificar username y contraseña"
    });
    return;
  }
};

checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        isOk: false,
        message: "Failed! Username is already in use!",
        message_es: "error: el usuario ya esta en uso"
      });
      return;
    }
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.id_role == 1) {
      next();
      return;
    }
    else{
      res.status(403).send({
        message: "Acceso restringido: Requiere rol de Administrador."
      });
      return;
    }
  });
};

const verifySignUp = {
  checkDuplicateUsername,
  isAdmin,
  checkMandatoryFields,
};

module.exports = verifySignUp;