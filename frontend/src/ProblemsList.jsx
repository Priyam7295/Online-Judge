import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProblemsList.css';
import { useNavigate } from 'react-router-dom';
import ShowSingleP from './ShowSingleP';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalProblems, setTotalProblems] = useState(0);
  const [basicP, setBasicP] = useState(0);
  const [easyP, setEasyP] = useState(0);
  const [mediumP, setMediumP] = useState(0);
  const [hardP, setHardP] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/problems', { withCredentials: true });

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setIsAuthenticated(true);
          console.log('Response data:', response.data);
          setProblems(response.data);

          // Update problem counts
          setTotalProblems(response.data.length);
          let count_basic = 0;
          let count_easy = 0;
          let count_medium = 0;
          let count_hard = 0;

          response.data.forEach((problem) => {
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
          setEasyP(count_easy);
          setMediumP(count_medium);
          setHardP(count_hard);
        } else {
          // If response.data is not an array, navigate to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error);

        // Redirect to login if not authenticated
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (error && error.response && (error.response.status !== 401 && error.response.status !== 403)) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="ProblemList">
        <h1>Problems-Pit</h1>
        <button className="total-prob">Total Problems: {totalProblems}</button>
      </div>
      <br />

      <ul>
        {Array.isArray(problems) && problems.length > 0 ? (
          problems.map((problem) => (
            <ShowSingleP
              key={problem._id}
              id={problem._id}
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
