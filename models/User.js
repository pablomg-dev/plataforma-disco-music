const mongoose = require("mongoose");
const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const User = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2 },
  lastName: { type: String, required: true, minLength: 2 },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return regex.test(v);
      },
      message: "You must enter a valid email",
    },
  },
  password: { type: String },
  favorites: { type: String },
});

module.exports = mongoose.model("User", User);