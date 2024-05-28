import React from 'react';
import './ShowSingleP.css';
import { useNavigate } from 'react-router-dom';

function ShowSingleP({ id ,name, description, difficulty }) {
  
  const navigate = useNavigate();
  function getDifficultyClass(difficulty) {
    switch (difficulty) {
      case 'basic':
        return 'basic-difficulty';
      case 'easy':
        return 'easy-difficulty';
      case 'medium':
        return 'medium-difficulty';
      case 'hard':
        return 'hard-difficulty';
      default:
        return '';
    }
  }
  
  function Solve_this_Problem(){
    
      navigate(`/${id}/${name}`);
  
    
  }

  return (
    <>


    <div className='prblm-row' >
        {/* <div>{key}</div> */}
        <div className="prblm-entry">{name}</div>
        {/* <div className="prblm-entry">{id}</div> */}
        <div className="prblm-entry">{description}</div>
        <div className={`prblm-entry ${getDifficultyClass(difficulty)}`}>
            Difficulty: <span className='style-level'>{difficulty}</span>
            
            <button className="solve-button" onClick={Solve_this_Problem} >Solve</button>
        </div>

    </div>
    <br />

    </>
  );
}

export default ShowSingleP;
