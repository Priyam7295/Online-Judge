import React, { useState } from "react";
import "./Contribute.css";
import axios from "axios";
import My_image from "./assets/two.png";
import { useNavigate } from "react-router-dom";
import Upload from "./Upload.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { TestcasesDownloadLink, OutputsDownloadLink } from "./Upload";
import swal from 'sweetalert';
function Contribute() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [hints, setHints] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [constraints, setConstraints] = useState("");
  const [testCases, setTestCases] = useState([
    { inputs: [], expectedOutput: "" },
  ]);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [difficultyError, setDifficultyError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showtc, setShowtc] = useState("");
  const [showoutput, setShowoutput] = useState("");

  // First checking that if user authenticated or not if not then redirect

  // const fetchData = async function () {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}/problems_post`, {
  //       withCredentials: true,
  //     });
  //     // Handle response data here
  //     if (!res.data.authenticated) {
  //       console.log("Caught You");
  //       navigate("/login");
  //     }

  //     setIsLoading(false);

  //     console.log(res.data);
  //   } catch (error) {
  //     // Handle errors here
  //     if (
  //       error.response &&
  //       (error.response.status === 401 || error.response.status === 403)
  //     ) {
  //       navigate("/login");
  //     }
  //   }
  // };

  // // Call the fetchData function
  // fetchData();

  // if (isLoading) {
  //   return <div>Please Wait!!</div>;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(TestcasesDownloadLink);
    console.log(OutputsDownloadLink);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/problems_post`,
        {
          name,
          description,
          difficulty,
          tags,
          hints,
          inputLink: TestcasesDownloadLink,
          outputLink: OutputsDownloadLink,
          showtc,
          showoutput,
          constraints,
        },
        { withCredentials: true }
      );
      const data = response.data;
      console.log("data", response.data);
      if (data.errors) {
        setNameError(data.errors.name);
        setDescriptionError(data.errors.description);
        setDifficultyError(data.errors.difficulty);
      } else {
        console.log("Question added successfully");
        swal({title:"Question Added" , text:"Thank you for your Contributions!.",icon:"success"})
        .then((value) => {
          navigate("/");
          setRedirect(true);
          
        });

      }
    } catch (error) {
      console.log(error);
    }
  };

  if (redirect) {
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
    setTestCases([...testCases, { inputs: [], expectedOutput: "" }]);
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  const addInputField = (testCaseIndex) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testCaseIndex].inputs.push({ key: "", value: "" });
    setTestCases(updatedTestCases);
  };

  const removeInputField = (testCaseIndex, inputIndex) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[testCaseIndex].inputs.splice(inputIndex, 1);
    setTestCases(updatedTestCases);
  };
  const minTC = 2;
  // console.log(showtc);
  // console.log(showoutput);
  return (
    <div className="container">
      <div className="left-section">
        <div className="make_contri">Make your</div>
        <div className="make_contri2">Contributions ...</div>
        <img className="contri-image" src={My_image} alt="Contribution" />

        <div className="instructions">
          <h2 className="instructions_heading">Instructions:</h2>
          <p className="instructions_tagline">Read instructions carefully :</p>
          <p className="instructions_points main_p">
            <span>1.</span> The first line of your input Text must contain an
            integer , which means the number of TC , followed by the inputs of
            Testcases
          </p>

          <p className="instructions_points">
            {" "}
            <span>2.</span>Make sure you give Test-Cases in the first txt file
            and outputs corresponding to the input Test-Cases in the second txt
            File. .{" "}
          </p>
          <p className="instructions_points">
            {" "}
            <span>3.</span> Add descriptive description and brief hints about
            the problem , and submit the problem .{" "}
          </p>
        </div>
      </div>

      <div className="right-section">
        <div className="form-container">
          <div className="first_form">
            <form onSubmit={handleSubmit} action="POST">
              <label className="probniklenge">
                PROBLEM NAME:
                <input
                  className="prob_inp"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name}
                />
              </label>
              <br />

              <label className="tagsniklenge">Choose Tags</label>
              <br />
              <select
                className="DropDown"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
              >
                <option value="" className="select_best_tag">
                  Select the best Suited Tag
                </option>
                <option value="arrays">Arrays</option>
                <option value="Hash-Map">Hash-Map</option>
                <option value="Maths">Maths</option>
                <option value="Binary-Search">Binary-Search</option>
                <option value="Tree">Tree</option>
              </select>
              <br />

              <label className="levelniklenge">Difficulty Level:</label>
              <br />
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
              <br />
              <br />

              <div className="label_show_tc">
                Add Sample TC to show it to User
                <textarea
                  className="show_tc"
                  type="text"
                  onChange={(e) => setShowtc(e.target.value)}
                  required
                  value={showtc}
                ></textarea>
              </div>

              <div className="label_show_output">
                Add Output to show User
                <textarea
                  className="show_output"
                  type="text"
                  onChange={(e) => setShowoutput(e.target.value)}
                  required
                  value={showoutput}
                ></textarea>
              </div>
              
              <label className="constraintsniklenge">
                <h2>ADD CONSTRAINTS:</h2>
                <textarea
                  className="constraints_area"
                  type="text"
                  onChange={(e) => setConstraints(e.target.value)}
                  required
                  value={constraints}
                />
              </label>
              <br />
            </form>
          </div>

          <div className="second_form">
            <form onSubmit={handleSubmit} action="POST">
              <div className="add_desc">
                ADD DESCRIPTION:
                <textarea
                  className="desc_area"
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  value={description}
                />
                <br />
              </div>
              <br />

              <div className="add_hints">
                HINTS:
                <textarea
                  className="hints_area"
                  type="text"
                  onChange={(e) => setHints(e.target.value)}
                  required
                  value={hints}
                />
                <br />
              </div>
              <p className="upload_txt">UPLOAD YOUR TEXT-FILES HERE:</p>

              <Upload />

              <div className="submit">
                <button className="submit-button" type="submit">
                  Submit
                </button>
              </div>
              <br />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
