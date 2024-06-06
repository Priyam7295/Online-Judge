import React from "react";
import "./ShowSingleP.css";
import { useNavigate } from "react-router-dom";

function ShowSingleP({ id, name, description, difficulty, tags, submissions }) {
  const navigate = useNavigate();

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
    navigate(`/problems/${id}`);
  }

  return (
    <div className="single-entry">
      <div className="name-entry">{name}</div>
      <div className="details">
        <div className="tags-entry">
          <div className="tags_sty">{tags}</div>
        </div>
        <div className="submissions-entry">Submissions: {submissions}</div>
        <div className={`difficulty-level ${getDifficultyClass(difficulty)}`}>
          {difficulty}
        </div>
      </div>
      <div className="action">
        <button className="solve-button" onClick={Solve_this_Problem}>
          Solve &gt;
        </button>
      </div>
    </div>
  );
}

export default ShowSingleP;
