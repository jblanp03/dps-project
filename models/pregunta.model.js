module.exports = (sequelize, Sequelize) => {
    const Pregunta = sequelize.define("pregunta", {
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },{
      tableName: 'Preguntas'
    });
  
    return Pregunta;
  };