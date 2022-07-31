const express = require("express");
const router = express.Router();
var mysql = require("mysql");
const Delivery = require("../models/Delivery");
const axios = require("axios");
// const db = require("../config/database-sql");
const mysql_Schema = require("../models/mysql_Schema");
const moment = require("moment");
const { Op } = require("sequelize");

const URL = "http://localhost:3400";
let ResDelivery = new Delivery();

// mysql connections settings
var con = mysql.createConnection({
  host: "143.47.232.141",
  port: 8090,
  user: "userout",
  password: "1q2w3e4R",
  database: "picthepac",
});

// connect to the data base
con.connect((err) => {
  if (err) {
    console.log("mysql connected unsuccess..");
    throw err;
  } else {
    console.log("mysql connected success..");
  }
});

// restApi Method -> get all open orders
router.get("/open", async (req, res) => {
  mysql_Schema.deliveries
    .findAll({
      where: {
        status: {
          [Op.ne]: 4,
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// restApi Method -> get all open orders
router.get("/openEmissary?:aid", async (req, res) => {
  mysql_Schema.emissary_deliveries
    .findAll({
      include: [{ model: mysql_Schema.deliveries }],
      where: {
        emissary: {
          [Op.eq]: req.query.aid,
        },
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// restApi Test
router.get("/Test", async (req, res) => {
  await mysql_Schema.customers
    .findAll({ include: [mysql_Schema.deliveries] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// restApi Method -> get one order
router.get("/?:id", async (req, res) => {
  let id = req.query.id;
  res.send(id);
  // if (isNaN(id) === false) {
  //   try {
  //     let sql_query = `select * from orders where order_number =  ${id}`;
  //     con.query(sql_query, (err, result) => {
  //       if (err) throw err;
  //       if (result.length != 0) {
  //         ResDelivery.GenerateNewDelivery(result, true, "find orders success");
  //         res.send(ResDelivery);
  //       } else {
  //         ResDelivery.GenerateNewDelivery(result, false, `order => ${id} not exists`);
  //         res.send(ResDelivery);
  //       }
  //     });
  //   } catch (error) {
  //     res.send(error);
  //   }
  // } else {
  //   res.send("Eror Request");
  // }
});

const findOne = function (req, res, next) {
  if (req.query.id) {
    mysql_Schema.deliveries
      .findOne({
        where: {
          order_number: {
            [Op.eq]: req.query.id,
          },
        },
      })
      .then((data) => {
        {
          data ? res.send(data) : res.send([]);
        }
        // if (data) res.send(data) else res.send("");
      });
  } else {
    next();
  }
};

// restApi Method -> get all orders
router.get("/", [findOne], async (req, res) => {
  mysql_Schema.deliveries
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// restApi Method -> add order
router.post("/add", async (req, res) => {
  await mysql_Schema.deliveries
    .create({
      // id: "id",
      customer_id: 8080,
      order_number: 1111,
      city: "Tel Aviv",
      address: "safas",
      area: "area",
      order_date_in: moment().format("YYYY-MM-DD"),
      delivery_date: moment().format("YYYY-MM-DD"),
      delivery_time: "10:00:00",
      status: "1",
      completed: true,
      deleted: 0,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400);
      res.send(err.errors[0].message);
    });
});

//restApi Method -> update order
router.put("/o?:id", async (req, res) => {
  let oid = req.query.id;
  let resData = req.body;
  if (isNaN(oid) === true) {
    res.send("Eror Request");
  }

  let updatedRows = await mysql_Schema.deliveries
    .update(
      {
        order_number: resData.order_number,
        city: resData.city,
        address: resData.address,
        area: resData.area,
        delivery_date: resData.delivery_date,
        delivery_time: resData.delivery_time,
        status: resData.status,
        completed: resData.completed,
        order_date_in: resData.order_date_in,
      },
      {
        where: { id: oid },
      }
    )
    .then((data) => {
      if (data[0] === 1) {
        ResDelivery.GenerateNewDelivery([], true, "update order success");
        res.send(ResDelivery);
      } else {
        ResDelivery.GenerateNewDelivery([], false, "An unusual malfunction occurred => order not update ");
        res.send(ResDelivery);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(updatedRows);
});

//restApi Method -> update order status // {remove}
router.put("/order_status", async (req, res) => {
  let resData = req.body;
  // send req /order to find order
  let finOrderByNumber = await axios.get(URL + port + Base + "/order", {
    params: {
      orderid: resData.order_num,
    },
  });
  if (finOrderByNumber.data.success) {
    try {
      let sqlQuery = `update order_details set status = ?
          where order_number = ?`;
      // if null update exists order data
      let sqlData = [resData.status, resData.order_num];
      con.query(sqlQuery, sqlData, (err, result) => {
        if (err) throw err.message;
        if (result.changedRows != 0) {
          res.json({
            massage: "update order success",
            data: result,
            success: true,
          });
        } else {
          res.json({
            massage: "An unusual malfunction occurred => order not update ",
            data: result,
            success: false,
          });
        }
      });
    } catch (error) {
      res.send(error);
    }
  } else {
    res.json({
      massage: "order => " + resData.order_number + " not exists",
      success: false,
    });
  }
});

// restApi to all req
router.get("*", (req, res) => {
  res.status(404);
  res.send("Bed request");
});

// set timeout by getting a milliseconds
let Timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = router;

// router.get("/", async (req, res) => {
//   try {
//     let sql_query = "SELECT * FROM orders";
//     con.query(sql_query, (err, result) => {
//       if (err) throw err;
//       if (result.length != 0) {
//         ResDelivery.GenerateNewDelivery(result, true, "find orders success");
//         res.send(ResDelivery);
//       } else {
//         ResDelivery.GenerateNewDelivery(result, false, "orders not exists");
//         res.send(ResDelivery);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// try {
//   let sqlQuery = `update deliveries set
//       order_number = ?,
//       city = ?,
//       address=?,
//       area=?,
//       delivery_date = ?,
//       delivery_time = ?,
//       status = ?,
//       completed = ?,
//       order_date_in = ?
//       where id = ?`;
//   let sqlData = [
//     resData.order_number,
//     resData.city,
//     resData.address,
//     resData.area,
//     resData.delivery_date,
//     resData.delivery_time,
//     resData.status,
//     resData.completed,
//     resData.order_date_in,
//     id,
//   ];
//   if (sqlData.includes(undefined)) {
//     console.log(sqlData);
//     ResDelivery.GenerateNewDelivery(sqlData, false, "missing parameter");
//     res.send(ResDelivery);
//     return;
//   }
//   con.query(sqlQuery, sqlData, (err, result) => {
//     if (err) throw err.message;
//     if (result.changedRows != 0) {
//       ResDelivery.GenerateNewDelivery([], true, "update order success");
//       res.send(ResDelivery);
//     } else {
//       ResDelivery.GenerateNewDelivery([], false, "An unusual malfunction occurred => order not update ");
//       res.send(ResDelivery);
//     }
//   });
// } catch (error) {
//   res.send(error);
// }
