import React, { useEffect, useState } from "react";
import axios from "axios";
import Graph from "./Graph.jsx";
import { useNavigate } from "react-router-dom";
import "./Myaccount.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Myaccount() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [totalproblems, setTotalproblems] = useState(0);
  const [countsolved, setCountsolved] = useState({ basic: 0, easy: 0, medium: 0, hard: 0 });
  const [counttotal, setCounttotal] = useState({ basic: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [prob_solved, setProb_solved] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/my_account`, {
          withCredentials: true,
        });
        const userData = response.data.data;

        setName(`${userData.firstname} ${userData.lastname}`);
        setRole(userData.role);
        setCountsolved({
          easy: userData.easyP || 0,
          medium: userData.mediumP || 0,
          basic: userData.basicP || 0,
          hard: userData.hardP || 0,
        });
        setTotalproblems(userData.totalProblems || 0);
        setCounttotal({
          easy: userData.easyT || 0,
          medium: userData.mediumT || 0,
          basic: userData.basicT || 0,
          hard: userData.hardT || 0,
        });
        setProb_solved(userData.solved_problems || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUserData();
  }, []);

  function findPercentage(count_solved, count_total) {
    if (count_total === 0) {
      return 0;
    }
    const percentage = (count_solved / count_total) * 100;
    return Math.round(percentage);
  }

  function returnToHome() {
    navigate("/");
  }

  function solve_problems() {
    navigate("/problems");
  }

  function get_problem(prob_id) {
    navigate(`/problems/${prob_id}`);
  }

  return (
    <div>
      <div className="account_navbar">
        <div className="account_logo">CRACK THE CODE</div>
        <div className="account_home" onClick={returnToHome}>
          HOME
        </div>
      </div>
      <div className="account_body">
        <div className="account_part1">
          <img
            src="https://img.freepik.com/free-vector/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style_138676-2387.jpg?size=626&ext=jpg&ga=GA1.1.1980570525.1716642798&semt=ais_user"
            alt="User avatar"
          />
          <button>{role}</button>
        </div>
        <div className="account_part2">
          <div className="greet_section">
            <h2>Hey {name}!</h2>
            <p>We're glad to see you again. Explore your account details and analyse your progress here.</p>
          </div>
          <div className="graph_section">
            <div className="basic_graph">
              <h2>BASIC</h2>
              <Graph
                solved={countsolved.basic}
                total={counttotal.basic}
                percentage={findPercentage(countsolved.basic, counttotal.basic)}
                color={{ r: 224, b: 242, g: 196 }}
              />
            </div>
            <div className="easy_graph">
              <h2>EASY</h2>
              <Graph
                solved={countsolved.easy}
                total={counttotal.easy}
                percentage={findPercentage(countsolved.easy, counttotal.easy)}
                color={{ r: 189, b: 217, g: 142 }}
              />
            </div>
            <div className="medium_graph">
              <h2>MEDIUM</h2>
              <Graph
                solved={countsolved.medium}
                total={counttotal.medium}
                percentage={findPercentage(countsolved.medium, counttotal.medium)}
                color={{ r: 243, b: 182, g: 110 }}
              />
            </div>
            <div className="hard_graph">
              <h2>HARD</h2>
              <Graph
                solved={countsolved.hard}
                total={counttotal.hard}
                percentage={findPercentage(countsolved.hard, counttotal.hard)}
                color={{ r: 243, b: 91, g: 65 }}
              />
            </div>
          </div>
          <div className="keep_solving">
            <button onClick={solve_problems}>Keep Solving</button>
          </div>
        </div>
      </div>
      <div className="solved_problems_section">
        <div className="solved_problems_table">
          <h2>Solved Problems</h2>
          <div className="table_container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Open Problem</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(prob_solved).map((problemId, index) => (
                  <tr key={problemId}>
                    <td>{prob_solved[problemId]}</td>
                    <td>
                      <button className="tc-btn" onClick={() => get_problem(problemId)}>
                        Click
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="solved_problems_image">
          <img
            src="https://img.freepik.com/free-vector/computer-programming-concept-illustration_114360-1181.jpg?size=626&ext=jpg"
            alt="Problem Solving"
          />
        </div>
      </div>
    </div>
  );
}

export default Myaccount;
