const mongoose = require('mongoose');

// Define the schema for individual input key-value pairs
const inputSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

// Define the schema for test cases
const testCaseSchema = new mongoose.Schema({
  inputs: {
    type: [inputSchema], // Array of input key-value pairs
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  }
});

// Define the main schema for problems
const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  hints: {
    type: String,
    required: true
  },
  testCases: {
    type: [testCaseSchema], // Array of test cases
    required: true
  }
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
