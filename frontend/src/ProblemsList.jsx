import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProblemsList.css';

import ShowSingleP from './ShowSingleP'; 

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [totalProblems , setTotalProblems] = useState(0);
  const [basicP , setBasicP] = useState(0);
  const [easyP , seteasyP] = useState(0);
  const [mediumP , setmediumP] = useState(0);
  const [hardP , sethardP] = useState(0);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/problems');
        console.log('Response data:', response.data);
        setProblems(response.data);
        // total problems
        setTotalProblems(response.data.length); // Update totalProblems

        // total basic problems
        let count_basic=0;
        let count_easy=0;
        let count_hard=0;
        let count_medium=0;

        response.data.forEach(problem => {
          switch (problem.difficulty) {
            case 'basic':
              count_basic++;
              break;
            case 'easy':
              count_easy++;
              break;
            case 'medium':
              count_medium++;
              break;
            case 'hard':
              count_hard++;
              break;
            default:
              break;
          }
        });

        setBasicP(count_basic);
        seteasyP(count_easy);
        setmediumP(count_medium);
        sethardP(count_hard);



      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error);
      }
    };

    fetchProblems();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="ProblemList">

        <h1 >Problems-Pit</h1>
      {/* <p className='total-prob' >Total Problems: {totalProblems}</p> */}
      <button className='total-prob'>Total Problems: {totalProblems}</button>
      </div>
      <br />

      <ul>
        {Array.isArray(problems) && problems.length > 0 ? (
          problems.map((problem) => (
            <ShowSingleP 
              id={problem._id} // Don't forget to add a key prop for each item in a list
              name={problem.name}
              description={problem.description}
              difficulty={problem.difficulty}
            />
          ))
        ) : (
          <p>No problems found</p>
        )}
      </ul>
    </div>
  );
};

export default ProblemsList;
