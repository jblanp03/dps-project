module.exports = (sequelize, Sequelize) => {
    const Qr = sequelize.define("qr", {
      level_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cod_alumno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      case: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }
    },{
      tableName: 'Qrs'
    });
  
    return Qr;
  };