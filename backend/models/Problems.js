const mongoose = require("mongoose");
const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter"],
  },
  tags: {
    type: String,
    required: [true, "Enter "],
  },
  description: {
    type: String,
    required: [true, "Enter "],
  },

  difficulty: {
    type: String,
    required: [true, "Enter "],
  },
  hints: {
    type: String,
    required: [true, "Enter hints"],
  },
  testCases: {
    type: Buffer,
    required: [true, "Please provide PDF data"],
  },
  outputs: {
    type: Buffer,
    required: [true, "Please provide PDF data"],
  },

});
const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
