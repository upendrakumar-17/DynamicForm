const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  type: {
    type: String,  //"planner", "performer", "crew".
    required: true,
  },

}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);