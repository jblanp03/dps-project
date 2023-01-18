const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const expiryDays = 0;
const expiryMins = 360; // 6 hours

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.createAccount = (req, res) => {
  // Save User to Database
  User.create({
    email: req.body.email,
    username: req.body.username,
    name: (req.body.name || ''),
    lastName: (req.body.lastName || ''),    
    password: bcrypt.hashSync(req.body.password, 8),
    id_role: req.body.id_role ? req.body.id_role : 2
  })
    .then(user => {
      res.send({ message: `User ${user.name} was registered successfully!` ,
      message_es: `El usuario ${user.name} se ha registrado satisfactoriamente!` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshlogIn = (req, res) => {
  var token = jwt.sign({ id: req.email, subject: req.sessionId }, config.secret, {
    expiresIn: 60*expiryMins + 86400*expiryDays 
  });
  //TODO: implement session control refresh for keepalive safety
  res.status(200).send({
    accessToken: token,
    sessionId: req.sessionId,
    expiryDate: new Date(new Date().getTime() + 60000*expiryMins + 86400000*expiryDays).toJSON(),
  });
};

exports.logIn = (req, res) => {
  let logInFilter = { username: 'none' };
  if (req.body.username){
    logInFilter = { username: req.body.username };
  }
  User.findOne({
    where: logInFilter
  })
    .then(async user => {
      try{
        if (!user) {
          return res.status(404).send({ message: "User Not found.",
            message_es: "Usuario no encontrado" });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
            message_es: "Contraseña incorrecta"
          });
        }
        var sessId = Math.floor(Math.random() * 10001);  
        //TODO: implement better session control for keepalive safety
  
        var token = jwt.sign({ id: user.email, subject: sessId }, config.secret, {
          expiresIn: 60*expiryMins + 86400*expiryDays 
        });
  
        res.status(200).send({
          id: user.id,
          name: user.name,
          lastName1: user.lastName1,
          username: user.username,
          accessToken: token,
          expiryDate: new Date(new Date().getTime() + 60000*expiryMins + 86400000*expiryDays),
          password: user.password,
          id_role: user.id_role
        });
      }catch(err){
        res.status(500).send({
          message: err.message || "An error occurred while retrieving records from Inventario.",
          message_es: "ha ocurrido un error desconocido al consultar el almacen"
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message, message_es: err.message });
    });
};

exports.forgotPassword = (req, res) => {
  const email = req.body.email
  let logInFilter = { email: 'none' };
  if (email){
    logInFilter = { email: email };
  }
  User.findOne({
    where: logInFilter
  })
  .then(user => {
    if(!user){
      return res.status(400).json({error: "No existe un usuario con este email"})
    }

    const palabra = randomstring.generate(10);

    var transporter = nodemailer.createTransport({
      host: 'smtp.upintelligence.es',
      port: 587,
      secure: false,
      auth: {
          user: 'x@upintelligence.es',
          pass: 'x'
      }
    });

    var mailOptions = {
      from: 'x@upintelligence.es',
      // to: 'x@upintelligence.es',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Su contraseña nueva es la siguiente: ${palabra}`
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
          res.send(err)
      }
      let userObj={
        password: bcrypt.hashSync(palabra, 8)
      };
      User.update(userObj, {
        where: { id: user.id }
      })
      res.send(data);
    });
  }).catch(err => {
    res.status(500).send("Ha ocurrido un error desconocido al consultar el usuario");
  });
    
}