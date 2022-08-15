const express = require("express");
const router = express.Router();
const Delivery = require("../models/deliveryModal");
const axios = require("axios");
// const db = require("../config/database-sql");
const mysql_Schema = require("../models/mysql_Schema");
const moment = require("moment");
const { Op } = require("sequelize");
const RES_ENTITY = require("../models/responseModal");

let ResDelivery = new Delivery();

/**  get one order by id */
const findOrder = function (req, res, next) {
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
        console.log(data);
        {
          data ? res.send(data) : res.send([]);
        }
        // if (data) res.send(data) else res.send("");
      });
  } else {
    next();
  }
};

/**  get one Customer by cid */
const findOneCustomer = async (cid) => {
  return new Promise(async (resolve) => {
    mysql_Schema.customers
      .findOne({
        where: {
          customer_id: {
            [Op.eq]: cid,
          },
        },
      })
      .then((data) => {
        if (data) {
          resolve(data);
        } else resolve(null);
      })
      .catch((err) => {
        console.log(err);
        resolve([]);
      });
  });
};

/**  get one Order by id */
const findOneOrder = async (od) => {
  return new Promise(async (resolve) => {
    mysql_Schema.deliveries
      .findOne({
        where: {
          order_number: {
            [Op.eq]: od,
          },
        },
      })
      .then((data) => {
        if (data) {
          resolve(data);
        } else resolve(null);
      })
      .catch((err) => {
        console.log(err);
        resolve([]);
      });
  });
};

/**  get all orders */
router
  .get("/", [findOrder], async (req, res) => {
    mysql_Schema.deliveries
      .findAll()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post("/", async (req, res) => {
    let reqBody = req.body;
    let customer = await findOneCustomer(reqBody.cid);

    if (customer) {
      await mysql_Schema.deliveries
        .create({
          customer_id: customer.customer_id,
          order_number: Math.floor(Math.random() * 9999999),
          city: reqBody.city ? reqBody.city : customer.city,
          address: reqBody.address ? reqBody.address : customer.address,
          area: reqBody.area ? reqBody.area : customer.area,
          phone: reqBody.phone ? reqBody.phone : customer.phone,
          order_date_in: moment().format("YYYY-MM-DD"),
          delivery_date: reqBody.delivery_time ? reqBody.delivery_time : moment("2000-01-01").format("YYYY-MM-DD"),
          delivery_time: reqBody.delivery_time ? reqBody.delivery_time : "00:00:00",
          status: "1",
          completed: "FALSE",
          deleted: 0,
        })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(400);
          res.send(RES_ENTITY.UPDATE_UNSUCCESS);
        });
    } else {
      res.send(RES_ENTITY.UPDATE_UNSUCCESS);
    }
  })
  .put("/", async (req, res) => {
    let reqBody = req.body;
    console.log(reqBody);
    let order = await findOneOrder(reqBody.order_number);
    if (order) {
      await mysql_Schema.deliveries
        .update(
          {
            city: reqBody.city ? reqBody.city : order.city,
            address: reqBody.address ? reqBody.address : order.address,
            area: reqBody.area ? reqBody.area : order.area,
            phone: reqBody.phone ? reqBody.phone : order.phone,
            order_date_in: reqBody.order_date_in ? reqBody.order_date_in : order.order_date_in,
            delivery_date: reqBody.delivery_date ? reqBody.delivery_date : order.delivery_date,
            delivery_time: reqBody.delivery_time ? reqBody.delivery_time : order.delivery_time,
            status: reqBody.status ? reqBody.status : order.status,
            completed: reqBody.completed ? reqBody.completed : order.completed,
            deleted: reqBody.deleted ? reqBody.deleted : order.deleted,
          },
          { where: { order_number: { [Op.eq]: reqBody.order_number } } }
        )
        .then((data) => {
          {
            data != 0 ? res.send(RES_ENTITY.UPDATE_SUCCESS) : res.send(RES_ENTITY.UPDATE_UNSUCCESS);
          }
        })
        .catch((err) => {
          res.status(404);
          res.send(RES_ENTITY.UPDATE_UNSUCCESS);
        });
    } else {
      res.send(RES_ENTITY.UPDATE_UNSUCCESS);
    }
  });
// .delete("/", async (req, res) => {
//   let order = await findOneOrder(reqBody.order_number);
//   if (order) {

//   } else {
//     res.send(RES_ENTITY.UPDATE_UNSUCCESS);
//   }
// });

/**  get all open orders */
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

/** method for emissary  */
router
  .get("/emissary?:aid", async (req, res) => {
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
  })
  .put("/emissary?:aid", async (req, res) => {
    let resData = req.body;

    await mysql_Schema.emissary_deliveries
      .update(
        { emissary_comments: resData.notes, status: resData.status },
        {
          where: {
            shipping: {
              [Op.eq]: parseInt(resData.order_number),
            },
          },
          individualHooks: true,
        }
      )
      .then((data) => {
        data = data[0];
        {
          data != 0 ? res.send(RES_ENTITY.UPDATE_SUCCUSS) : res.send(RES_ENTITY.UPDATE_UNSUCCESS);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
        res.send(RES_ENTITY.UPDATE_UNSUCCESS);
      });
  });

router.all("**", (req, res) => {
  res.status(404);
  res.send(RES_ENTITY.BAD_REQUEST);
});

// set timeout by getting a milliseconds
let Timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = router;

//restApi Method -> update order
// router.put("/o?:id", async (req, res) => {
//   let oid = req.query.id;
//   let resData = req.body;
//   if (isNaN(oid) === true) {
//     res.send("Eror Request");
//   }

//   let updatedRows = await mysql_Schema.deliveries
//     .update(
//       {
//         order_number: resData.order_number,
//         city: resData.city,
//         address: resData.address,
//         area: resData.area,
//         delivery_date: resData.delivery_date,
//         delivery_time: resData.delivery_time,
//         status: resData.status,
//         completed: resData.completed,
//         order_date_in: resData.order_date_in,
//       },
//       {
//         where: { id: oid },
//       }
//     )
//     .then((data) => {
//       if (data[0] === 1) {
//         ResDelivery.GenerateNewDelivery([], true, "update order success");
//         res.send(ResDelivery);
//       } else {
//         ResDelivery.GenerateNewDelivery([], false, "An unusual malfunction occurred => order not update ");
//         res.send(ResDelivery);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   // console.log(updatedRows);
// });

//restApi Method -> update order status // {remove}
// router.put("/order_status", async (req, res) => {
//   let resData = req.body;
//   // send req /order to find order
//   let finOrderByNumber = await axios.get(URL + port + Base + "/order", {
//     params: {
//       orderid: resData.order_num,
//     },
//   });
//   if (finOrderByNumber.data.success) {
//     try {
//       let sqlQuery = `update order_details set status = ?
//           where order_number = ?`;
//       // if null update exists order data
//       let sqlData = [resData.status, resData.order_num];
//       con.query(sqlQuery, sqlData, (err, result) => {
//         if (err) throw err.message;
//         if (result.changedRows != 0) {
//           res.json({
//             massage: "update order success",
//             data: result,
//             success: true,
//           });
//         } else {
//           res.json({
//             massage: "An unusual malfunction occurred => order not update ",
//             data: result,
//             success: false,
//           });
//         }
//       });
//     } catch (error) {
//       res.send(error);
//     }
//   } else {
//     res.json({
//       massage: "order => " + resData.order_number + " not exists",
//       success: false,
//     });
//   }
// });
