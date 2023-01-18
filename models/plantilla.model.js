module.exports = (sequelize, Sequelize) => {
    const Plantilla = sequelize.define("plantilla", {
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },{
      tableName: 'Plantillas'
    });
  
    return Plantilla;
  };