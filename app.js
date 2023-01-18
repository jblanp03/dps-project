const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();
const User = db.user;
const Role = db.role;
var bcrypt = require("bcryptjs");

var corsOptions = {
  origin: [
    'http://0.0.0.0',
    'https://0.0.0.0',
    'http://localhost:8081'
  ]
};
app.use(cors(corsOptions));

db.sequelize.sync();
app.use(express.json());

setTimeout(async () => {
  await Role.findAll()
    .then(async role => {
      if (!role || role.length == 0){
        await Role.create({id: 1, name: "admin"})
        await Role.create({id: 2, name: "usuario"})
        await User.findAll()
          .then(user => {
            if (!user || user.length == 0){
              User.create({id: 1, username: "admin", email: "admin@admin.es", name: "admin", password: bcrypt.hashSync("admin", 8), id_role: 1})
            }
          })
          .catch(err => {
            console.log({
              message:
                err.message || `Some error occurred while retrieving users`
            });
          });
      }
    })
    .catch(err => {
      console.log({
        message:
          err.message || `Some error occurred while retrieving roles`
      });
    });

  await User.findAll()
    .then(async user => {
      if (!user || user.length == 0){
        User.create({id: 1, username: "admin", email: "admin@admin.es", name: "admin", password: bcrypt.hashSync("admin", 8), id_role: 1})
      }
    })
    .catch(err => {
      console.log({
        message:
          err.message || `Some error occurred while retrieving users`
      });
    });
}, 700);

// Routes
require('./routes/static.routes')(app, express);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/plantilla.routes')(app);
require('./routes/pregunta.routes')(app);
require('./routes/tipo.routes')(app);

const http = require('http').createServer(app);
const socket = require('./socket');

socket(http);

module.exports = http;