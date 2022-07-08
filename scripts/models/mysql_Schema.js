const { Sequelize } = require("sequelize");
const db = require("../config/database-sql");

// const customers_deliveries = customers.hasMany(deliveries, { as: "deliveries" });

const deliveries = db.sequelize.define("delivery", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  customer_id: {
    type: Sequelize.INTEGER,
  },
  order_number: {
    type: Sequelize.INTEGER,
  },
  city: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  area: {
    type: Sequelize.STRING,
  },
  order_date_in: {
    type: Sequelize.DATE,
  },
  delivery_date: {
    type: Sequelize.DATE,
  },
  delivery_time: {
    type: Sequelize.TIME,
  },
  status: {
    type: Sequelize.INTEGER,
  },
  completed: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.INTEGER,
  },
});

const customers = db.sequelize.define("customer", {
  // include: [{}],
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  customer_id: {
    type: Sequelize.INTEGER,
  },
  fname: {
    type: Sequelize.STRING,
  },
  lname: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  phone_sec: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  area: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  home_num: {
    type: Sequelize.INTEGER,
  },
});

customers.hasMany(deliveries, {
  sourceKey: "customer_id",
  foreignKey: {
    name: "customer_id",
    allowNull: false,
  },
});

// deliveries.belongsToMany(deliveries,{ through: customers })

module.exports = { customers, deliveries };
