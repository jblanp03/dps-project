module.exports = (app) => {
    const tipo = require('../controllers/tipo.controller');
  
    var router = require('express').Router();
  
    router.get('/:id', tipo.findOne);
    router.get('/', tipo.findAll);
    router.post('/', tipo.create);
    router.put('/:id', tipo.update);
  
    app.use('/api/tipos', router);
  };
  