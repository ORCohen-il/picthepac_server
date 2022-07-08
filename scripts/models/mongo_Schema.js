const mongoose = require("mongoose");
const UIDGenerator = require("uid-generator");

const mongoConnect = mongoose.connect("mongodb://userout:1q2w3e4R%24@143.47.232.141:8091", {
  ssl: false,
  authSource: "admin",
  directConnection: true,
  dbName: "Picthepac",
});

const UserSchema = new mongoose.Schema({
  // id: { type: ObjectId },
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

const User = mongoose.model("user", UserSchema);

const TokenSchema = new mongoose.Schema({
  // id: { type: ObjectId },
  email: { type: String },
  name: { type: String },
  token: { type: String },
  date_created: { type: String },
  date_end: { type: String },
  valid: { type: Boolean },
});

const Auth = mongoose.model("token", TokenSchema);

const newToken = async () => {
  let uuid = new UIDGenerator();
  return await uuid.generate();
};

module.exports = { User, Auth, newToken, mongoConnect };
