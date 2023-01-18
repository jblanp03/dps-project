const dbConfig = require("../config/db.config.js");

const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.QueryTypes = QueryTypes;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.pregunta = require("../models/pregunta.model.js")(sequelize, Sequelize);
db.tipo = require("../models/tipo.model.js")(sequelize, Sequelize);
db.plantilla = require("./plantilla.model.js")(sequelize, Sequelize);
db.qr = require("./qr.model.js")(sequelize, Sequelize);
db.chat = require("./chat.model.js")(sequelize, Sequelize);

db.role.hasMany(db.user, {foreignKey: "id_role"});
db.user.belongsTo(db.role, {foreignKey: "id_role"});

db.tipo.hasMany(db.pregunta, {foreignKey: "id_tipo"});
db.pregunta.belongsTo(db.tipo, {foreignKey: "id_tipo"});

db.tipo.hasMany(db.pregunta, {foreignKey: "id_tipo"});
db.pregunta.belongsTo(db.tipo, {foreignKey: "id_tipo"});

db.plantilla.hasMany(db.qr, {foreignKey: "id_plantilla"});
db.qr.belongsTo(db.plantilla, {foreignKey: "id_plantilla"});

db.qr.hasMany(db.chat, {foreignKey: "id_qr"});
db.chat.belongsTo(db.qr, {foreignKey: "id_qr"});

db.plantilla_pregunta = sequelize.define('plantilla_pregunta', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    tableName: 'Plantillas_preguntas'
  }
);

db.respuesta = sequelize.define('respuesta', {
    fecha: {
      type: Sequelize.DATE,
      allowNull: false
    },
    res: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'Respuestas'
  }
);

db.plantilla.belongsToMany(db.pregunta, { through: db.plantilla_pregunta, foreignKey: "id_plantilla", otherKey: "id_pregunta" });
db.pregunta.belongsToMany(db.plantilla, { through: db.plantilla_pregunta, foreignKey: "id_pregunta", otherKey: "id_plantilla" });

// db.plantilla.hasMany(db.plantilla_pregunta, {foreignKey: "id_plantilla"});
db.pregunta.hasMany(db.plantilla_pregunta, {foreignKey: "id_pregunta"});
db.plantilla_pregunta.belongsTo(db.pregunta, {foreignKey: "id_pregunta"});

db.qr.belongsToMany(db.plantilla_pregunta, { through: db.respuesta, foreignKey: "id_qr", otherKey: "id_plantilla_preguntas" });
db.plantilla_pregunta.belongsToMany(db.qr, { through: db.respuesta, foreignKey: "id_plantilla_preguntas", otherKey: "id_qr" });

module.exports = db;