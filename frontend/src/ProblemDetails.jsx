import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProblemDetails.css";
import Editor from "@monaco-editor/react";
import HintsTab from "../smallCompo/HintsTab.jsx";
import { Passed } from "../smallCompo/ShowTC.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate } from "react-router-dom";
// import {  } from "./PassedButton.jsx";
import swal from "sweetalert";

import PassComponent from "../smallCompo/PassComponent.jsx";

function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeButton, setActiveButton] = useState("p_desc");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [showCodingScreen, setShowCodingScreen] = useState(true);
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [theme, setTheme] = useState("vs-dark");
  const [showsubmissions, setShowsubmissions] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [countpassed, setCountpassed] = useState(0);
  const [countfailed, setCountfailed] = useState(0);
  const [passed, setPassed] = useState(0);
  const [beforeSolved ,SetbeforeSolved] = useState(false);
  const [tcPassed, setTCPassed] = useState(0);
  // const [firstFailed, setFirstFailed] = useSbar_gtate(-1); // Renamed to camelCase
  const sampleCodes = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main(){\n  //Welcome to Crack the Code!  \n\n   return 0;  \n}; `,
    py: `print("Hello, World!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  };

  console.log("vv", verdict);
  const [code, setCode] = useState(sampleCodes[selectedLanguage]);
  useEffect(() => {
    setCode(sampleCodes[selectedLanguage]);
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/problems/${id}`, {
          withCredentials: true,
        });
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblem();
  }, [id]);
  // console.log(response.data);
  const handleButtonClick = (buttonType) => {
    swal({
      title: "HINTS",
      text: "Showing Hints will deduct your score",
      icon: "warning",
      button: "SHOW HINTS ",
    }).then((value) => {
      setActiveButton(buttonType);
      if (buttonType === "p_hint") {
        setShowHints(!showHints);
      } else {
        setShowHints(false);
      }
    });
  };

  const closeHints = () => {
    setShowHints(false);
    setActiveButton("p_desc"); // Optional: switch back to description tab
  };

  // ////////// adding history of submissions

  // /////////////

  function Submission_history() {
    console.log("Submissions button clicked");
    navigate(`/submission_history/${id}`);
  }

  async function Code_Submit() {
    setTCPassed(0);
    const data_to_send = {
      language: selectedLanguage,
      code: code,
      tcLink: problem.inputLink,
      ExpectedOutputLink: problem.outputLink,
      problemId: problem.problemID,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/submit`,
        data_to_send,
        {
          withCredentials: true,
        }
      );

      console.log("Response:", response);
      console.log("Response:", response.data.results);
      console.log(
        "Length of response.data.results:",
        response.data.results.length
      );

      setTCPassed(response.data.results.length);
      // If all the testcases are passed , ie expected output and hardcoded are same;
      if (response.data.success && !response.data.alreadySolved) {
        console.log("All test cases passed!");
        setVerdict("All Test Cases Passed!");
        setPassed(1);
        setCountpassed(countpassed + 1);
        setCountpassed(response.data.passedTestCases);
      } else if (response.data.success && response.data.alreadySolved) {
        // when all passed but already solved earlier
        console.log("All test case passed but it was solved earlier");
        SetbeforeSolved(true);
        setVerdict(
          "All Test Cases Passed!\nYou will Get Marks only for first Submission"
        );
        setPassed(1);
      }
      // If fails , then we keep whats first failed;
      else if (!response.data.success) {
        console.log("Not all passed!");
        console.log("First failed is", response.data.first_failed);
        // setFirstFailed(response.data.first_failed); // Update state
        setVerdict(response.data.error);
        setPassed(0);
      }
      setActiveTab("verdict");
    } catch (error) {
      setActiveTab("verdict");

      console.log("Error response:", error.response);
      setVerdict(error.response?.data?.error || "An error occurred.");
    }

    console.log("verdict after state update:", verdict);
  }

  async function Code_Run() {
    const data_to_send = { language: selectedLanguage, code: code, input };

    try {
      const response = await axios.post(`${API_BASE_URL}/run`, data_to_send, {
        withCredentials: true,
      });

      console.log("Code Run Response:", response);

      if (response.status === 200) {
        setOutput(response.data.output);
      } else {
        setOutput("Unexpected response status.");
      }
      console.log(response);

      setShowCodingScreen(false);
      setActiveTab("output");
    } catch (error) {
      setActiveTab("output");
      if (error.response && error.response.status === 404) {
        setOutput(`Currently ${selectedLanguage} is not supported.`);
      } else {
        setOutput(
          error.response?.data?.error ||
            "There must be some error with your code."
        );
        console.log("Error:", error);
      }
    }
  }

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const navigate = useNavigate();
  function goHome(e) {
    e.preventDefault();
    navigate("/");
  }

  function Submissions() {
    setShowsubmissions(!showsubmissions);
  }
  function move_to_Account() {
    navigate(`/myaccount`);
  }
  console.log(problem);
  return (
    <div>
      {problem ? (
        <div>
          <div className="navbar">
            <header className="header">
              <h1 className="logo">
                <a href="#" onClick={goHome}>
                  Crack the Code
                </a>
              </h1>
              <ul className="main-nav">
                <li>
                  <a href="#" onClick={move_to_Account}>
                    Account
                  </a>
                </li>
                <li>
                  <a href="#">Report an issue</a>
                </li>
              </ul>
            </header>
          </div>

          <div className="container_prob">
            <div className="Item-1_des">
              <div className="desc_and_hint">
                <button
                  type="button"
                  className={`p_desc ${
                    activeButton === "p_desc" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("p_desc")}
                >
                  Description
                </button>
                <button
                  type="button"
                  className={`p_hint ${
                    activeButton === "p_hint" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("p_hint")}
                >
                  Hints
                </button>
                {activeButton === "p_hint" && (
                  <div>
                    <HintsTab hints={problem.hints} onClose={closeHints} />
                  </div>
                )}

                <button className="my_sub" onClick={Submission_history}>
                  Submissions
                </button>
              </div>

              <div>
                <div className="name_and_tags">
                  <div className="prob_name">{problem.name}</div>
                  <div className="tags_name">{problem.tags}</div>
                </div>
                <button className={`p_level${problem.difficulty}`}>
                  {problem.difficulty}
                </button>
                <div className="reviewQ">
                  <img
                    className="upvote"
                    src="https://www.svgrepo.com/show/11343/like.svg"
                    alt=""
                  />
                  <img
                    className="devote"
                    src="https://tse2.mm.bing.net/th?id=OIP.gIIID9Dl1jE_KJpOfoNfcgHaHa&pid=Api&P=0&h=180"
                    alt=""
                  />
                </div>
                <div className="prob_info">
                  <h2 className="prob_state">Problem Statement</h2>
                  <div className="prob_description">{problem.description}</div>

                  <div className="prob_constraints">
                    <h2 className="prob_state prob_con">CONSTRAINTS</h2>
                    <div className="con">{problem.constraints} </div>
                  </div>

                  <h2 className="tc_heading">TEST CASES:</h2>
                  <div className="test_cases">
                    <h3>INPUTS:</h3>
                    <pre className="show_tc">{problem.showtc}</pre>
                    <h3>OUTPUTS:</h3>

                    <pre className="show_output">{problem.showoutput}</pre>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="passed-tests">
  Passed Test Cases: {countpassed}
</div> */}

            <div className="Item-2_prob">
              <div className="select_block">
                <div className="choose_language">
                  <select
                    name=""
                    id=""
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                    }}
                  >
                    <option value="cpp">CPP</option>
                    <option value="py">PYTHON</option>
                    <option value="java">JAVA</option>
                  </select>
                </div>
                <div className="choose_theme">
                  <label htmlFor="themeSelect"></label>
                  <select
                    name=""
                    id=""
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value);
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="vs-dark">Dark</option>
                  </select>
                </div>
              </div>

              <Editor
                height="75%"
                language={selectedLanguage}
                theme={theme}
                value={code}
                options={{
                  inlineSuggest: true,
                  fontSize: "16px",
                  formatOnType: true,
                  autoClosingBrackets: true,
                  minimap: { scale: 10 },
                }}
                onChange={handleCodeChange}
              />

              <div className="sample_io_section">
                <div className="sample_io_headings">
                  <div
                    className={`sample_io_heading ${
                      activeTab === "input" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("input")}
                  >
                    INPUT
                  </div>
                  <div
                    className={`sample_io_heading ${
                      activeTab === "output" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("output")}
                  >
                    OUTPUT
                  </div>
                  <div
                    className={`sample_io_heading ${
                      activeTab === "verdict" ? "active" : ""
                    }`}
                    onClick={() => toggleTab("verdict")}
                  >
                    VERDICT
                  </div>
                </div>
                <div className="sample_io_content">
                  {activeTab === "input" && (
                    <textarea
                      className="input_area"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  )}

                  {activeTab === "output" && (
                    <textarea
                      className="output_area"
                      value={output}
                      onChange={(e) => setOutput(e.target.value)}
                    />
                  )}
                  {/* All Test Cases Passed! */}

                  {activeTab === "verdict" && (
                    <>
                      {verdict === "All Test Cases Passed!" ||
                      verdict ===
                        "All Test Cases Passed!\nYou will Get Marks only for first Submission" ? (
                          <div className="pass_compo">
                            <PassComponent totalTC={tcPassed} />
                            {beforeSolved && <div className="first_sub_marks">You will get marks for first Submission Only!!</div>  }
                          </div>
                      ) : (
                        <textarea
                          className="verdict_area"
                          value={verdict}
                          onChange={(e) => setVerdict(e.target.value)}
                          readOnly
                        />
                      )}
                    </>
                  )}



                  {/* <div>{tcPassed}</div> */}
                </div>
              </div>
              <div className="button-group">
                <button className="run-tc-button" onClick={Code_Run}>
                  Run Sample TC
                </button>
                <button className="run-button" onClick={Code_Run}>
                  Run
                </button>
                <button className="submit-button" onClick={Code_Submit}>
                  Submit
                </button>
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
