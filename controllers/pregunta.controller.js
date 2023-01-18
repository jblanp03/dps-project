const db = require("../models");
const Pregunta = db.pregunta;
const Tipo = db.tipo;

exports.findAll = (req, res) => {
  Pregunta.findAll({
    include: Tipo
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error buscando las preguntas",
      });
    });
};

exports.create = (req, res) => {
  Pregunta.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error guardando la pregunta",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Pregunta.findOne({
    where: {id: id},
    include: Tipo
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error buscando la pregunta de id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Pregunta.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Pregunta editado correctamente",
        });
      } else {
        res.send({
          message: `No se pudo editar la pregunta`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error editando la pregunta de id=" + id,
      });
    });
};

// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Pregunta.destroy({
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Pregunta eliminada correctamente",
//         });
//       } else {
//         res.status(500).send({
//           message: `No se pudo eliminar la pregunta`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "No se elimino la pregunta de id=" + id,
//       });
//     });
// };