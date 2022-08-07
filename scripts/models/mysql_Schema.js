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
    key: true,
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
    type: Sequelize.ENUM("TRUE", "FALSE"),
  },
  deleted: {
    type: Sequelize.INTEGER,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const emissary = db.sequelize.define(
  "emissary",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    aid: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

const emissary_deliveries = db.sequelize.define(
  "emissary_deliveries",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    emissary: {
      type: Sequelize.INTEGER,
    },
    shipping: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    date: {
      type: Sequelize.STRING,
    },
    emissary_comments: {
      type: Sequelize.STRING,
    },
    updatedAt: {
      type: Sequelize.STRING,
    },
  }
  // {
  //   hooks: {
  //     afterUpdate: (record, options) => {
  //       options.raw
  //       record.
  //       record.dataValues.updatedAt = moment("2018-10-10").format("YYYY-MM-DD HH:mm:ss");
  //     },
  //   },
  // }
);

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

emissary_deliveries.hasOne(deliveries, {
  sourceKey: "shipping",
  foreignKey: {
    name: "order_number",
    allowNull: false,
  },
});

const cities = db.sequelize.define("cities", {
  // include: [{}],
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  symbol: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  name_eng: {
    type: Sequelize.STRING,
  },
  symbol_state: {
    type: Sequelize.INTEGER,
  },
  name_state: {
    type: Sequelize.STRING,
  },
});

const streets = db.sequelize.define("streets", {
  // include: [{}],
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  symbol: {
    type: Sequelize.INTEGER,
  },
  city_name: {
    type: Sequelize.STRING,
  },
  symbol_city: {
    type: Sequelize.INTEGER,
  },
});

// deliveries.belongsToMany(deliveries,{ through: customers })

module.exports = { customers, deliveries, cities, streets, emissary, emissary_deliveries };
