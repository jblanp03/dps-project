module.exports = (app) => {
    const pregunta = require('../controllers/pregunta.controller');
  
    var router = require('express').Router();
  
    router.get('/:id', pregunta.findOne);
    router.get('/', pregunta.findAll);
    router.post('/', pregunta.create);
    router.put('/:id', pregunta.update);
  
    app.use('/api/preguntas', router);
  };
  