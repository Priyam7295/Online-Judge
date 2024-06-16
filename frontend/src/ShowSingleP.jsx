import React, { useState, useEffect } from "react";
import "./ShowSingleP.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkmark } from 'react-checkmark';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ShowSingleP({ user_id, prob_id, name, description, difficulty, tags, submissions }) {
  const navigate = useNavigate();
  const [probsolved, setProbsolved] = useState("NOT ATTEMPTED");
  const [loading, setLoading] = useState(true);

  function getDifficultyClass(difficulty) {
    switch (difficulty) {
      case "basic":
        return "basic-difficulty";
      case "easy":
        return "easy-difficulty";
      case "medium":
        return "medium-difficulty";
      case "hard":
        return "hard-difficulty";
      default:
        return "";
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${user_id}`, { withCredentials: true });
        const userData = response.data;
        const solvedProblems = userData.solvedProblems;
        const solvedProblemsMap = new Map(Object.entries(solvedProblems));

        if (solvedProblemsMap.has(prob_id)) {
          setProbsolved("DONE");
        } else {
          setProbsolved("NOT ATTEMPTED");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user_id, prob_id]);

  function Solve_this_Problem() {
    navigate(`/problems/${prob_id}`);
  }

  return (
    <div className={`single-entry ${probsolved === "DONE" ? "done" : "not-attempted"}`}>
      <div className="name-entry">{name}</div>
      <div className="tags-entry">{tags}</div>
      <div className="submissions-entry">
        { (probsolved === "DONE" && <Checkmark size='24px' color='green' />)}
        {/* { (probsolved !== "DONE" && <Checkmark size='16px' color='blue' />)} */}
      </div>
      <div className={`difficulty-level ${getDifficultyClass(difficulty)}`}>{difficulty}</div>
      <div className="action">
        <button className={`solve-button ${probsolved === "DONE" ? "done" : "not-attempted"}`} onClick={Solve_this_Problem}>
          Solve &gt;
        </button>
      </div>
    </div>
  );
}

export default ShowSingleP;
