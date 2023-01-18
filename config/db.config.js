module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "jorgeblanp",
    DB: "atvirtualchatbot",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
}