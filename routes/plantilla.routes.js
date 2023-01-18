module.exports = (app) => {
    const plantilla = require('../controllers/plantilla.controller');
    const chatbot = require('../controllers/chatbot.controller');
  
    var router = require('express').Router();
  
    router.get('/', plantilla.findAll);
    router.get('/:id', plantilla.findOne);
    router.get('/preguntas/all', plantilla.findAllPreguntas);
    router.post('/qr', plantilla.createQr);
    router.post('/plantilla', plantilla.createPlantilla);
    router.post('/chatbot/:id_qr', chatbot.python);
    router.post('/respuestas', plantilla.addRes);
    // router.put('/:id', plantilla.editQr);
    router.delete('/:id', plantilla.deletePlantilla);
  
    app.use('/api/plantillas', router);
  };
  