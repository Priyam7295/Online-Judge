import React, { useState, useEffect } from "react";
import "./SubmissionHistory.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import axios from "axios";
import Modal from "./Model_PastSub.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SubmissionHistory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [problem_name, setProblem_name] = useState("");
  const [wrong, setWrong] = useState(0);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/your_submissions/${id}`,
          {
            withCredentials: true,
          }
        );
        setProblem_name(response.data[0].prob_name);

        const responseObject = response.data[0];
        const submissionsArray = responseObject.submissions;

        setSubmissionHistory(submissionsArray);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching submission history:", error);
        setLoading(false);
      }
    };

    fetchSubmissionHistory();
  }, [id]);

  function returnHome() {
    navigate("/");
  }

  function handleViewCode(code) {
    setSelectedCode(code);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  function getVerdictClass(verdict) {
    const lowerCaseVerdict = verdict.toLowerCase();

    if (lowerCaseVerdict === "passed") {
      return "passed";
    } else if (lowerCaseVerdict === "compilation error") {
      return "compilation-error";
    } else if (lowerCaseVerdict === "output length mismatched") {
      return "outout-length-mismatched";
    } else {
      return "test-case-failed";
    }
  }

  function move_to_prob_page(){
    navigate(`/problems/${id}`);
  }
  function move_to_prob_list(){
    navigate(`/problems`);
  }

  return (
    <div className="whole_body">
      <div className="submission_navbar">
        <div className="return_to_home" >
          {/* <botton onClick={returnHome}> CRACK THE CODE</> */}
          <button type="button" onClick={returnHome}>CRACK THE CODE</button>
        </div>
        <div className="account_Section" >
            <img src="https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png" alt="Image" />
            <h2 onClick={()=>{navigate("/myaccount")}} >ACCOUNT</h2>
        </div>
      </div>

      <div className="submission_header">
        <div className="Submission_heading">
          SUBMISSION HISTORY
          <img
            src="https://cdn.pixabay.com/photo/2014/04/03/10/29/rocket-310662_1280.png"
            alt=""
          />
        </div>
        <div className="wrong_right_ratio">
          <div className="name_prob_hist">

          </div>
          <div className="go_to_all_prob">
            <button className="go_to_prob_his" type="button" onClick ={move_to_prob_page} >
            <span>&#8592;</span> Go to Problem
            </button>
            <button type="button" className="solve_more_hist" onClick ={move_to_prob_list}><span>&#8592;</span> Solve Other Problems </button>
          </div>
        </div>
      </div>

      <div className="all_past_submission">
      <div class="prob_name_hist">
            <span>{problem_name}</span>
      </div>
        {loading ? (
          <p>Hold Tight, Running...</p>
        ) : (
          <table className="hist_table">
            <thead>
              <tr>
                <th className="hist_head">Language</th>
                <th className="hist_head">Verdict</th>
                <th className="hist_head">Submission Date</th>
                <th className="hist_head">Code</th>
              </tr>
            </thead>
            <tbody>
              {submissionHistory.map((submission) => (
                <tr key={submission._id}>
                  <td className="hist_lang">{submission.language}</td>
                  <td className={`hist_verdict `}>
                    <button
                      className={`${getVerdictClass(submission.verdict)}`}
                    >
                      {submission.verdict}
                    </button>
                  </td>
                  <td className="hist_date">
                    {submission.date.substring(0, 10)}
                  </td>
                  <td>
                    <button
                      className="view_code_hist"
                      onClick={() => handleViewCode(submission.code)}
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        show={modalVisible}
        handleClose={handleCloseModal}
        code={selectedCode}
      />
    </div>
  );
}

export default SubmissionHistory;
