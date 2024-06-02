// Contribute.js
import React, { useState } from 'react';
import './Contribute.css';
import axios from 'axios';
import My_image from './assets/two.png';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Contribute() {
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [hints, setHints] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState([{ inputs: [], expectedOutput: '' }]);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [difficultyError, setDifficultyError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // First checking that if user authenticated or not if not then redirect
      
  const fetchData = async function() {
    try {
      const res = await axios.get('http://localhost:5000/problems_post', {
        withCredentials: true
      });
      // Handle response data here
      if(!res.data.authenticated){
        console.log("Pakda liya na bssdke")
        navigate('/login');

      }

      setIsLoading(false);

      console.log(res.data);
    } catch (error) {
      // Handle errors here
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      }
    }
  };
  
  // Call the fetchData function
  fetchData();

  if (isLoading) {
    return <div>Please Wait!!</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the number of test cases is less than minTC
      if (testCases.length < minTC) {
        alert(`Please add at least ${minTC} test cases.`);
        return; // Exit the function without saving
      }
    }
    catch (err) {
      console.log("error")
    }
      
    
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
        navigate('/');
        setRedirect(true);
        // Redirect or handle success
      }
    } catch (error) {
      console.log(error);
    }
  };

  if(redirect){
    return <Navigate to="/" />;
  }

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
  const minTC =2;

  return (
    <div className="container">
      <div className="left-section">
      <div className='make_contri'>Make your</div>
      <div className='make_contri2' >Contributions ...</div>
        <img className='contri-image' src={My_image} alt="Contribution" />

        <div className='instructions'>
         <h2 className='instructions_heading' >Instructions:</h2>
          <p className='instructions_tagline'>Read instructions carefully :</p>
          <p className='instructions_points'><span>1.</span> Add a minimum of {minTC}, more test cases are preferred depending on the problem.</p>

         <p className='instructions_points'> <span>2.</span> There is an option "Add inputs" , by clicking on it you can add inputs , by specifying key value pair . eg: key = Array , value =[1 2 3 4]</p>
         <p className='instructions_points'> <span>3.</span> Add descriptive description and brief hints about the problem , and submit the problem . </p>
        </div>

      </div>
          
      <div className="right-section">
        <div className="form-container">
          <form onSubmit={handleSubmit} action="POST">
            <label >Problem name:</label>
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

            <div className="test-case-section">
              {testCases.map((testCase, testCaseIndex) => (
                <div key={testCaseIndex} className="test-case-block">
                  <div className="test-case-title">Test Case {testCaseIndex + 1}</div>
                  <button className='add_input_buton' type="button" onClick={() => addInputField(testCaseIndex)}>Add Inputs</button>
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
                  {testCases.length > 2 && <button className='remtc' type="button" onClick={() => removeTestCase(testCaseIndex)}>Remove Test Case</button>}
                </div>
              ))}
            </div>
            
            <button className='addtc' type="button" onClick={addTestCase}>Add Test Case</button>
            <br />
            <input className='create_prob' type="submit" value="Submit" />
          </form>


          <form action="" className='second_form'>
            <div className="hints_and_desc" >
              <label>Description:</label>
              <textarea className='desc_area'
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                required
                value={description}
              />
              <br />
              <label>Hints:</label>
              <textarea className='hints_area'
                type="text"
                onChange={(e) => setHints(e.target.value)}
                required
                value={hints}
              />
              <br />
              <div className="test-case-counter">Number of Test Cases: <span className="counter_num" > {testCases.length} </span></div>

            
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contribute;


