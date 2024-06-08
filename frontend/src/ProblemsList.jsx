import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js/auto";
import "./ProblemsList.css";
import { useNavigate } from "react-router-dom";
import User_img from "./assets/user.png";
import ShowSingleP from "./ShowSingleP";
// import { useNavigate } from "react-router-dom"
Chart.register(ArcElement);

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [basicP, setBasicP] = useState(0);
  const [easyP, setEasyP] = useState(0);
  const [mediumP, setMediumP] = useState(0);
  const [hardP, setHardP] = useState(0);
  const navigate = useNavigate();
  const [solved_easy, setSolved_easy] = useState(0);
  const [solved_basic, setSolved_basic] = useState(0);
  const [solved_medium, setSolved_medium] = useState(0);
  const [solved_hard, setSolved_hard] = useState(0);
  const [userid, setUserid] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const calculateWidth = (solved, total) => {
    return total === 0 ? "0%" : `${(solved / total) * 100}%`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/problems", {
          withCredentials: true,
        });

        if (Array.isArray(response.data.all_problems)) {
          setIsAuthenticated(true);
          setProblems(response.data.all_problems);

          // TOTAL PROBLEMS
          let countBasic = 0;
          let countEasy = 0;
          let countMedium = 0;
          let countHard = 0;
          console.log(response);

          // SOLVED BY USERS
          setSolved_easy(response.data.easySolved);
          setSolved_basic(response.data.basicSolved);
          setSolved_medium(response.data.mediumSolved);
          setSolved_hard(response.data.hardSolved);
          const user_id = response.data.user_id;
          setUserid(user_id);
          setDataLoaded(true);  // Mark data as loaded
          console.log(user_id);

          response.data.all_problems.forEach((problem) => {
            switch (problem.difficulty) {
              case "basic":
                countBasic++;
                break;
              case "easy":
                countEasy++;
                break;
              case "medium":
                countMedium++;
                break;
              case "hard":
                countHard++;
                break;
              default:
                break;
            }
          });

          setBasicP(countBasic);
          setEasyP(countEasy);
          setMediumP(countMedium);
          setHardP(countHard);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError(error);

        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Redirecting ...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!dataLoaded) {
    return <div>Loading...</div>;  // Ensure data is loaded before rendering
  }

  const data = {
    labels: ["Basic", "Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [basicP, easyP, mediumP, hardP],
        backgroundColor: ["#FDF0D5", "#78D0AA", "#EB5E55", "#e56881"],
        hoverBackgroundColor: ["#FFD54F", "#81C784", "#FF8A65", "#FF5252"],
      },
    ],
  };

  function moveHome(){
    navigate("/");
  }

  return (
    <div>
      <div className="navbar navbar_more">
        <header className="header header_more">
          <h1 className="logo">
            <a href="#" onClick={moveHome}>Crack the Code</a>
          </h1>
          <ul className="main-nav">
            <img className="User_img" src={User_img} alt="" />
            <li>
              <a href="#">Account</a>
            </li>
            <li>
              <a href="#">Report an issue</a>
            </li>
          </ul>
        </header>
      </div>

      <div className="main_block">
        <div className="ProblemList">
          <div className="prob-container">
            <div className="tpart">
              <div className="heading_p">Top Coding Questions</div>
            </div>
            <div className="tags_sec">
              <div className="tags_head">Filter by Tags</div>
              <div className="tags_input"></div>
            </div>

            <div className="all_prob_list">
              <ul>
                {Array.isArray(problems) && problems.length > 0 ? (
                  problems.map((problem) => (
                    <ShowSingleP
                      key={problem._id}
                      prob_id={problem._id}
                      user_id={userid}

                      name={problem.name}
                      description={problem.description}
                      difficulty={problem.difficulty}
                      tags={problem.tags}
                      submissions={"No"}
                    />
                  ))
                ) : (
                  <p>No problems found</p>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="side_block">
          <h4>Total Problems:</h4>
          <div className="pie-chart-container">
            <Pie data={data} />
          </div>
          <h3 className="bar_g">Your Progress</h3>
          <div className="solved-problems">
            <ul>
              <li className="bar basic-bar">
                <div
                  className="bar-inner basic-bar"
                  style={{ width: calculateWidth(solved_basic, basicP) }}
                ></div>
                <span className="count">
                  {solved_basic}/{basicP}
                </span>
              </li>
              <li className="bar easy-bar">
                <div
                  className="bar-inner easy-bar"
                  style={{ width: calculateWidth(solved_easy, easyP) }}
                ></div>
                <span className="count">
                  {solved_easy}/{easyP}
                </span>
              </li>
              <li className="bar medium-bar">
                <div
                  className="bar-inner medium-bar"
                  style={{ width: calculateWidth(solved_medium, mediumP) }}
                ></div>
                <span className="count">
                  {solved_medium}/{mediumP}
                </span>
              </li>
              <li className="bar hard-bar">
                <div
                  className="bar-inner hard-bar"
                  style={{ width: calculateWidth(solved_hard, hardP) }}
                ></div>
                <span className="count">
                  {solved_hard}/{hardP}
                </span>
              </li>
            </ul>
          </div>

          <div className="leader_board">Leaderboard bar</div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
