import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js/auto";
import "./ProblemsList.css";
import { useNavigate } from "react-router-dom";
import User_img from "./assets/user.png";
import ShowSingleP from "./ShowSingleP";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
  const [selectedTag, setSelectedTag] = useState(""); // State to hold selected tag

  const calculateWidth = (solved, total) => {
    return total === 0 ? "0%" : `${(solved / total) * 100}%`;
  };

  useEffect(() => {
    const get_by_tag = async () => {
      if (!selectedTag) {
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE_URL}/query/problem/${selectedTag}`,
          {
            withCredentials: true,
          }
        );
        setProblems(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    get_by_tag();
  }, [selectedTag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/problems`, {
          withCredentials: true,
        });

        if (Array.isArray(response.data.all_problems)) {
          setIsAuthenticated(true);
          setProblems(response.data.all_problems);

          let countBasic = 0;
          let countEasy = 0;
          let countMedium = 0;
          let countHard = 0;

          setSolved_easy(response.data.easySolved);
          setSolved_basic(response.data.basicSolved);
          setSolved_medium(response.data.mediumSolved);
          setSolved_hard(response.data.hardSolved);
          const user_id = response.data.user_id;
          setUserid(user_id);
          setDataLoaded(true);

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
    return <div>Loading...</div>;
  }

  const data = {
    labels: ["Basic", "Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [basicP, easyP, mediumP, hardP],
        backgroundColor: ["#CCE8CC", "#AEE1AE", "#FF8360", "#E94233"],
        hoverBackgroundColor: ["#FFD54F", "#81C784", "#FF8A65", "#FF5252"],
      },
    ],
  };

  function moveHome() {
    navigate("/");
  }

  function openAccount() {
    navigate("/myaccount");
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div>
      <div className="navbar navbar_more">
        <header className="header header_more">
          <h1 className="logo">
            <a href="#" onClick={moveHome}>
              Crack the Code
            </a>
          </h1>
          <ul className="main-nav">
            <img className="User_img" src={User_img} alt="" />
            <li>
              <a onClick={openAccount}>Account</a>
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
              <div className="heading_image">
                <img src="https://img.freepik.com/free-vector/man-shows-gesture-great-idea_10045-637.jpg?t=st=1718393335~exp=1718396935~hmac=f5906f097b297b7c87fc81b6d8d9cc08127f1ff4d9a12fd9cbf97d4f652afdef&w=1060" alt="" />
              </div>
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
          <div className="pie-chart-container">
          <h4>Total Problems:</h4>
            <Pie data={data} />
          </div>

          {/*TAGS OPTION  */}
          <div className="tags_sec">
            <div className="tags_head">Filter by Tags</div>
            <div className="tags_input">
              <label>
                <input
                  type="checkbox"
                  checked={selectedTag === "arrays"}
                  onChange={() => handleTagClick("arrays")}
                />
                ARRAYS
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTag === "Maths"}
                  onChange={() => handleTagClick("Maths")}
                />
                MATHS
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTag === "Hash-Map"}
                  onChange={() => handleTagClick("Hash-Map")}
                />
                HASH-MAP
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTag === "Binary-Search"}
                  onChange={() => handleTagClick("Binary-Search")}
                />
                BINARY-SEARCH
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTag === "tree"}
                  onChange={() => handleTagClick("tree")}
                />
                TREE
              </label>
            </div>
          </div>

          <h3 className="bar_g">Progress Tracker</h3>
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
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
