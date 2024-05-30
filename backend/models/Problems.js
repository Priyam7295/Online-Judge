const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: String,
  description: String,
  difficulty: String,
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  tags:String,
  hints:String,
});

const Problems = mongoose.model('Problem', problemSchema);


module.exports = Problems;
