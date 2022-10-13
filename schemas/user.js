const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: String,
  bank: Number,
  wallet: Number,
  userName: String,
  userIcon: { type: String, required: false },
});

module.exports = model("user", userSchema, "users");
