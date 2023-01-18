module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define("chat", {
      autor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nodo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      mensaje: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      }
    },{
      tableName: 'Chats'
    });
  
    return Chat;
  };