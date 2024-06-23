import React, { useState } from 'react';
import './HeaderLogin.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Logo from './assets/logo2.png'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Header() {
  const [logout, setLogout] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  function remove_logout_popOut() {
    setLogoutMessage('');
  }

  const manageLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true
      });
      setLogout(true);
      setLogoutMessage('You have successfully logged out.');
    } catch (error) {
      console.log("Error while logging out", error);
    }

    setTimeout(remove_logout_popOut, 1500);
  };

  const jwtToken = Cookies.get('jwt');
  const isLoggedIn = jwtToken !== undefined;

  const navigate = useNavigate();

  async function go_to_contributionPage() {
    try {
      const response = await axios.get(`${API_BASE_URL}/check_if_admin`, {
        withCredentials: true
      });

      console.log(response.data.role); // Log the full response for debugging
      console.log(response.data.authorized); // Log the full response for debugging

      const role =response.data.role;
      const isAuthorized =response.data.authorized;
      console.log(role);
      console.log(isAuthorized);

      if(isAuthorized===false) {
        // alert("Login/Signup to Continue !");
        // swal("Login/Signup to continue!");
        swal({title:"No User Found" , text:"Authenticate yourself to continue.",icon:"warning"})
        .then((value) => {
          navigate("/login");
          
        });
      }
      else{
        if(role==="admin"){
          swal({
            text:"You are naviagating as an admin! . Do you want to continue?"
          })
          .then((value) => {

            navigate("/problems_post");
          });

        }
        else{
          // alert("Only Admin can contribute!");
          swal({
            title: "ADMIN ONLY!",
            text: "Only Admin can contribute!",
            icon: "error",
          });
        }

      }
    } catch (error) {
      console.log("Error verifying user", error);
    }
  }

  return (
    <div className="headerf">
        <img className="logo_banner" src={Logo} alt="NOT FOUND" />
      <div className="auth-buttons">
        {/* Display logout message */}
        

        {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
        <button className="contribute" onClick={go_to_contributionPage}>
          Contribute
        </button>

        <button className="login-button">
          <Link to="/signup">SignUp</Link>
        </button>
        <button className="logout-button" onClick={manageLogout}>
          Logout
        </button>

        <button className="signup-button">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </div>
  );
}

export default Header;
