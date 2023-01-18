const db = require("../models");
const Plantilla = db.plantilla;
const Qr = db.qr;
const Plantilla_pregunta = db.plantilla_pregunta;
const Respuesta = db.respuesta;
const Pregunta = db.pregunta;
const Tipo = db.tipo;

exports.createPlantilla = (req, res) => {
  const plantilla = {
    nombre: req.body.nombre
  }
  Plantilla.create(plantilla)
    .then((data) => {
        const preguntas = req.body.preguntas
        for(x in preguntas){
            Plantilla_pregunta.create({
                id_pregunta: preguntas[x].id_pregunta,
                id_plantilla: data.id
            })
        }
        //MODELO DEL JSON A IMPORTAR EN EL BODY
        // {
        //     "nombre": "Plantilla 1",
        //     "preguntas": [
        //         {
        //             "id_pregunta": 1
        //         },
        //         {
        //             "id_pregunta": 3
        //         }
        //     ]
        // }
        res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error guardando la plantilla",
      });
    });
};

exports.createQr = (req, res) => {
  Qr.create(req.body)
    .then((data) => {        
        res.send({msg: "qr creado"})
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error guardando el qr",
      });
    });
};

exports.editQr = (req, res) => {
  const id = req.params.id;
  Qr.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Qr editado correctamente",
        });
      } else {
        res.send({
          message: `No se pudo editar el qr`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error editando el qr de id=" + id,
      });
    });
};

exports.addRes = async (req, res) => {
  const respuestas = req.body.respuestas
  const cod_alumno = req.body.cod_alumno
  let id_qr
  let level = 0
  await Qr.findOne({
    where: {cod_alumno: cod_alumno}
  })
    .then((data) => {
      level = data.level_alumno
      id_qr = data.id
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error buscando el qr de id=" + id,
      });
    });

  const content = await Pregunta.count({
    where: {
      id_tipo: 2
    }
  });

  const delivery = await Pregunta.count({
    where: {
      id_tipo: 3
    }
  });

  try{
    let media_content = 0, media_delivery = 0, suggestions = null, caso = 0;

    for(x in respuestas){
      Respuesta.create({
        fecha: new Date(),
        res: respuestas[x].res ? respuestas[x].res : null,
        id_qr: id_qr,
        id_plantilla_preguntas: respuestas[x].id_plantilla_preguntas
      })
      await Plantilla_pregunta.findOne({
        where: {
          id: respuestas[x].id_plantilla_preguntas
        },
        include: {
          model: Pregunta
        }
      })
        .then((data) => {
          if(data.preguntum.id_tipo == 2){
            media_content += respuestas[x].res
          }else if(data.preguntum.id_tipo == 3){
            media_delivery += respuestas[x].res
          }else if(data.preguntum.id_tipo == 4){
            suggestions = respuestas[x].res
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error buscando el qr de id=" + id_QR,
          });
        });
    }
    media_content = media_content / content
    media_delivery = media_delivery / delivery
    if(media_content == 5 && media_delivery == 5 && suggestions != null && level == 0){
      caso = 1
    }else if(media_content == 5 && media_delivery == 5 && suggestions != null && level == 1) {
      caso = 2
    }else if(media_content >= 4 && media_delivery >= 4 && suggestions != null && level == 2){
      caso = 3
    }else if(media_content < 5 && media_delivery < 5 && level == 4){
      caso = 4
    }
    await Qr.update({case: caso},{
      where: {
        id: id_qr
      }
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Plantilla editada correctamente",
          });
        } else {
          res.send({
            message: `No se pudo editar la plantilla`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error editando la plantilla de id=" + id,
        });
      });
  }
  catch {
    res.status(500).send({
      message: "Error guardando los resultados"
    });
  };
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Qr.findOne({
    where: {id: id},
    include: {
      model: Plantilla,
      include: {
        model: Plantilla_pregunta
      },
      include: {
        model: Pregunta,
        include: {
          model: Tipo
        },
      }
    }
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error buscando el qr de id=" + id,
      });
    });
};

exports.deletePlantilla = (req, res) => {
  const id = req.params.id;

  Plantilla.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Plantilla eliminada correctamente",
        });
      } else {
        res.status(500).send({
          message: `No se pudo eliminar la plantilla`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se elimino la plantilla de id=" + id,
      });
    });
};

exports.findAll = (req, res) => {
  Plantilla.findAll({
    include: {
      model: Qr,
      include: {
        model: Plantilla_pregunta,
        include: {
            model: Pregunta
        },
        through: {
            attributes: ['res']
        }
      }
    }
    
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error buscando las plantillas",
      });
    });
};

exports.findAllPreguntas = (req, res) => {
  Plantilla.findAll({
    include: {
        model: Pregunta
    }
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error buscando las plantillas con sus preguntas",
      });
    });
};