import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProblemDetails.css';

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeButton, setActiveButton] = useState('p_desc');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${id}`, {
          withCredentials: true
        });
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  return (
    <div>
      {problem ? (
        <div>
          <div className='navbar'>
            <header className="header">
              <h1 className="logo"><a href="#">Crack the Code</a></h1>
              <ul className="main-nav">
                <li><a href="#">Account</a></li>
                <li><a href="#">Report an issue</a></li>
              </ul>
            </header>
          </div>

          <div className='container_prob'>
            <div className='Item-1_des'>

              <div className='desc_and_hint'>
                <button
                  type="button"
                  className={`p_desc ${activeButton === 'p_desc' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('p_desc')}
                >
                  Description
                </button>
                <button
                  type="button"
                  className={`p_hint ${activeButton === 'p_hint' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('p_hint')}
                >
                  Hint
                </button>
              </div>

              <div>
                <div className ='name_and_tags'>
                  <div className='prob_name'>{problem.name}</div>
                  <div className='tags_name'>{problem.tags}</div>
                </div>
                <button className={`p_level${problem.difficulty}`}>{problem.difficulty}</button>
                <div className ='reviewQ'>
                  <img className='upvote' src="https://www.svgrepo.com/show/11343/like.svg" alt="" />
                  <img className='devote' src="https://tse2.mm.bing.net/th?id=OIP.gIIID9Dl1jE_KJpOfoNfcgHaHa&pid=Api&P=0&h=180" alt="" />
                </div>
                <div className ="prob_info">
                  <h2 className='prob_state' >Problem Statement</h2>
                  <div className='prob_description'>{problem.description}</div>

                  <h2 className='tc_heading'>Test Cases</h2>
                  <div>
                    {problem.testcase1 && (
                      <>
                        <div className='enclose_ftc'>

                          <h3 className='tc_num'>Test Case 1:</h3>
                          <div className='tc_out'>

                            {problem.testcase1.inputs.map((input, index) => (
                              <p key={index}>{input.key}: {input.value}</p>
                            ))}
                            <p  >Expected Output: {problem.testcase1.expectedOutput}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {problem.testcase2 && (
                      <>
                      <div className='enclose_ftc'>

                        <h3 className='tc_num'>Test Case 2:</h3>
                        <div className='tc_out'>

                          {problem.testcase2.inputs.map((input, index) => (
                            <p key={index}>{input.key}: {input.value}</p>
                          ))}
                          <p>Expected Output: {problem.testcase2.expectedOutput}</p>
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className='Item-2_prob'>
              <div className='temp-code'>
                {/* Additional code functionality can go here */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProblemDetails;
