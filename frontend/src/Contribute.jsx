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
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [difficultyError, setDifficultyError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hints="lere land ke";
    try {
      const response = await axios.post('http://localhost:5000/problems_post', {
        name,
        description,
        difficulty,
        tags,
        hints:hints,
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

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="contributeQ">Contribute</div>
        
        
        <img className ='contri-image' src={My_image} alt="Contribution" />
      </div>
      <div className="right-section">
        <div className="form-container">
          <form onSubmit={handleSubmit} action="POST">
            <label htmlFor="">Problem name:</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
            <br />
            
            <label htmlFor="">Choose Tags</label>
              <select className='DropDown'
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
            <label htmlFor="">Description:</label>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              required
              value={description}
            />
            <br />
            <label className='levelniklenege' htmlFor="">Difficulty Level:</label>
            <select className='DropDown'
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
            {testCases.map((testCase, index) => (
              <div key={index}>
                <label>Test Case {index + 1}</label>
                <input
                  type="text"
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Expected Output"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                />
                <button className='remtc' type="button" onClick={() => removeTestCase(index)}>Remove</button>
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
