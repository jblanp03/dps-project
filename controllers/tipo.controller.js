const db = require("../models");
const Tipo = db.tipo;

exports.findAll = (req, res) => {
  Tipo.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error buscando los tipos",
      });
    });
};

exports.create = (req, res) => {
  Tipo.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error guardando el tipo",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Tipo.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error buscando el tipo de id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Tipo.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tipo editado correctamente",
        });
      } else {
        res.send({
          message: `No se pudo editar el tipo`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error editando el tipo de id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Tipo.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tipo eliminado correctamente",
        });
      } else {
        res.status(500).send({
          message: `No se pudo eliminar el tipo`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se elimino el tipo de id=" + id,
      });
    });
};