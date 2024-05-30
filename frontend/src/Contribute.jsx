import React, { useState } from 'react';
import './Contribute.css';
import axios from 'axios';
import My_image from './assets/two.png';
import { Navigate } from 'react-router-dom';

function Contribute() {
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState([{ inputs: [], expectedOutput: '' }]);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [difficultyError, setDifficultyError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hints = "lere land ke";
    try {
      const response = await axios.post('http://localhost:5000/problems_post', {
        name,
        description,
        difficulty,
        tags,
        hints,
        testCases
      }, { withCredentials: true });
      const data = response.data;
      
      if (data.errors) {
        setNameError(data.errors.name);
        setDescriptionError(data.errors.description);
        setDifficultyError(data.errors.difficulty);
      } else {
        console.log("Question added successfully");
        alert("Thank you for your contribution!");
        // Redirect or handle success
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTestCaseChange = (index, key, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][key] = value;
    setTestCases(updatedTestCases);
  };

  const handleInputChange = (testCaseIndex, inputIndex, key, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testCaseIndex].inputs[inputIndex][key] = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { inputs: [], expectedOutput: '' }]);
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  const addInputField = (testCaseIndex) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testCaseIndex].inputs.push({ key: '', value: '' });
    setTestCases(updatedTestCases);
  };

  const removeInputField = (testCaseIndex, inputIndex) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testCaseIndex].inputs.splice(inputIndex, 1);
    setTestCases(updatedTestCases);
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="contributeQ">Contribute</div>
        <img className='contri-image' src={My_image} alt="Contribution" />
      </div>
      <div className="right-section">
        <div className="form-container">
          <form onSubmit={handleSubmit} action="POST">
            <label>Problem name:</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
            <br />
            
            <label>Choose Tags</label>
            <select
              className='DropDown'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            >
              <option value="">Select Tags</option>
              <option value="arrays">Arrays</option>
              <option value="Hash-Map">Hash-Map</option>
              <option value="Maths">Maths</option>
              <option value="Binary-Search">Binary-Search</option>
            </select>
            <br />
            
            <label>Description:</label>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              required
              value={description}
            />
            <br />
            
            <label className='levelniklenege'>Difficulty Level:</label>
            <select
              className='DropDown'
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="">Select difficulty level</option>
              <option value="basic">Basic</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <br />
            
            {testCases.map((testCase, testCaseIndex) => (
              <div key={testCaseIndex}>
                <label>Test Case {testCaseIndex + 1}</label>
                <button type="button" onClick={() => addInputField(testCaseIndex)}>Add Input</button>
                {testCase.inputs.map((input, inputIndex) => (
                  <div key={inputIndex}>
                    <input
                      type="text"
                      placeholder="Input Key"
                      value={input.key}
                      onChange={(e) => handleInputChange(testCaseIndex, inputIndex, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Input Value"
                      value={input.value}
                      onChange={(e) => handleInputChange(testCaseIndex, inputIndex, 'value', e.target.value)}
                    />
                    <button className='remtc' type="button" onClick={() => removeInputField(testCaseIndex, inputIndex)}>Remove</button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Expected Output"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleTestCaseChange(testCaseIndex, 'expectedOutput', e.target.value)}
                />
                <button className='remtc' type="button" onClick={() => removeTestCase(testCaseIndex)}>Remove Test Case</button>
              </div>
            ))}
            
            <button className='addtc' type="button" onClick={addTestCase}>Add Test Case</button>
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
