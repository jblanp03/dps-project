const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error buscando los usuarios",
      });
    });
};

exports.create = (req, res) => {
  User.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error guardando el usuario",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error buscando el usuario de id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario editado correctamente",
        });
      } else {
        res.send({
          message: `No se pudo editar el usuario`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error editando el usuario de id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario eliminado correctamente",
        });
      } else {
        res.status(500).send({
          message: `No se pudo eliminar el usuario`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se elimino el usuario de id=" + id,
      });
    });
};

exports.newPass = (req, res) => {
  console.log(req.params)
  console.log(req.body)
  User.findOne({
    where: { id: req.params.id },
  })
    .then(async (user) => {
      try {
        if (!user) {
          return res
            .status(404)
            .send({
              message: "User Not found.",
              message_es: "Usuario no encontrado",
            });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.oldpassword,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
            message_es: "Contraseña incorrecta",
          });
        } else {
          User.update(
            { password: bcrypt.hashSync(req.body.newpassword, 8) },
            {
              where: { id: req.params.id },
            }
          )
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Password was updated successfully.",
                });
              } else {
                res.send({
                  message: `Cannot update password. Maybe not found or req.body empty!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating User password",
              });
            });
        }
      } catch (err) {
        res.status(500).send({
          message:
            err.message ||
            "An error occurred while retrieving records from Inventario.",
          message_es:
            "ha ocurrido un error desconocido al consultar el almacen",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message, message_es: err.message });
    });
};
