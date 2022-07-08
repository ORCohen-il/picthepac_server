const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("picthepac", "userout", "1q2w3e4R", {
  host: "143.47.232.141",
  port: "8090",
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: false,
  },
});

const connect_valid = async () => {
  return new Promise(async (resolve, reject) => {
    await sequelize
      .authenticate()
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(false);
      });
  });
};

module.exports = { connect_valid, sequelize };
