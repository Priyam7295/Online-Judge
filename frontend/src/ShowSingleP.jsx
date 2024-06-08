import React, { useState, useEffect } from "react";
import "./ShowSingleP.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShowSingleP({ user_id, prob_id, name, description, difficulty, tags, submissions }) {
  const navigate = useNavigate();
  const [probsolved, setProbsolved] = useState("NOT ATTEMPTED");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${user_id}`, { withCredentials: true });
        const userData = response.data;
        const solvedProblems = userData.solvedProblems;
        const solvedProblemsMap = new Map(Object.entries(solvedProblems));

        if (solvedProblemsMap.has(prob_id)) {
          setProbsolved("DONE");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserData();
  }, [user_id, prob_id]);

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

  function Solve_this_Problem() {
    navigate(`/problems/${prob_id}`);
  }

  return (
    <div className="single-entry">
      <div className="name-entry">{name}</div>
      <div className="details">
        <div className="tags-entry">
          <div className="tags_sty">{tags}</div>
        </div>
        <div className="submissions-entry">{loading ? "LOADING" : probsolved}</div> {/* Display "LOADING" while loading */}
        <div className={`difficulty-level ${getDifficultyClass(difficulty)}`}>
          {difficulty}
        </div>
      </div>
      <div className="action">
        <button className={`solve-button ${probsolved === "DONE" ? "done" : "not-attempted"}`} onClick={Solve_this_Problem}>
          Solve &gt;
        </button>
      </div>
    </div>
  );
}

export default ShowSingleP;
