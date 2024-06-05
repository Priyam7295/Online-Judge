import React, { useState } from "react";
import "./Contribute.css";
import axios from "axios";
import My_image from "./assets/two.png";
import { useNavigate } from "react-router-dom";

function Contribute() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [hints, setHints] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/problems_post",
        {
          name,
          description,
          difficulty,
          tags,
          hints,
        },
        { withCredentials: true }
      );
      const data = response.data;

      if (data.errors) {
        // Handle validation errors if any
      } else {
        console.log("Question added successfully");
        alert("Thank you for your contribution!");
        navigate("/");
        // Redirect or handle success
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="make_contri">Make your</div>
        <div className="make_contri2">Contributions ...</div>
        <img className="contri-image" src={My_image} alt="Contribution" />

        <div className="instructions">
          <h2 className="instructions_heading">Instructions:</h2>
          <p className="instructions_tagline">Read instructions carefully :</p>
          <p className="instructions_points">
            <span>1.</span> Add a minimum of 2, more test cases are preferred
            depending on the problem.
          </p>

          <p className="instructions_points">
            {" "}
            <span>2.</span> Add descriptive description and brief hints about
            the problem , and submit the problem .{" "}
          </p>
        </div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <div className="first_form">
            <form onSubmit={handleSubmit} action="POST">
              <label className="probniklenge">PROBLEM NAME:</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
              <br />

              <label className="tagsniklenge">Choose Tags</label>
              <select
                className="DropDown"
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

              <label className="levelniklenge">Difficulty Level:</label>
              <select
                className="DropDown"
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

              {/* Add input block for test cases */}
              <div className="file-upload">
                <label className="file-label">Upload Test Cases:</label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setOutputsFile(e.target.files[0])}
                  
                  />
              </div>

              <div className="file-upload">
                <label className="file-label">Upload Outputs:</label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setOutputsFile(e.target.files[0])}
           
                />
              </div>
            </form>
            <input  onClick={handleSubmit} className="create_prob" type="submit" value="Submit" />
          </div>

          <div className="second_form">
            <label className="add_desc">ADD DESCRIPTION:</label>
            <textarea
              className="desc_area"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              required
              value={description}
            />
            <br />

            <label className="add_hints">HINTS:</label>
            <textarea
              className="hints_area"
              type="text"
              onChange={(e) => setHints(e.target.value)}
              required
              value={hints}
            />
            <br />
            <p className="make_sure">Make sure that you have at least 30 Test Cases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
