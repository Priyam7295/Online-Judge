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
  constraints:{
    type:String , 
    required:[true , "Enter the contrainst"],
  },
  showtc :{
    type:String ,
    required:[true , "Enter 1-2 Tc to show"]
  } ,
  showoutput:{
    type:String ,
    required:[true , "Enter Output of those 1-2 TC to show"]
  },
  inputLink:{
    type:String , 
    required:[true , "Enter Testcases"],
  },

  outputLink: {
    type: String,
    required: [true, "Please provide PDF data"],
  },


});
const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
