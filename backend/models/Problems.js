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
  inputLink:{
    type:String , 
    required:[true , "Enter hints"],
  },

  outputLink: {
    type: String,
    required: [true, "Please provide PDF data"],
  },

});
const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
