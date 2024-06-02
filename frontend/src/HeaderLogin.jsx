import React, { useState } from 'react';
import './HeaderLogin.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Header() {
  const [logout, setLogout] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  function remove_logout_popOut() {
    setLogoutMessage('');
  }

  const manageLogout = async () => {
    try {
      await axios.get(`http://localhost:5000/logout`, {
        withCredentials: true
      });
      setLogout(true);
      setLogoutMessage('You have successfully logged out.');
    } catch (error) {
      console.log("Error while logging out", error);
    }

    setTimeout(remove_logout_popOut , 1500);
  };

  const jwtToken = Cookies.get('jwt');
  const isLoggedIn = jwtToken !== undefined;




  return (
    <div className="headerf">
      <div className="auth-buttons">
                {/* Display logout message */}
                {logoutMessage && <p className="logout-message">{logoutMessage}</p>}
        <button className="contribute">
          <Link to='/problems_post'>Contribute</Link>
        </button>

        <button className="login-button">
          <Link to="/signup">SignUp</Link>
        </button>

        <button className="logout-button" onClick={manageLogout}>
          Logout
        </button>
        
        {!isLoggedIn && (
          <button className="signup-button">
            <Link to="/login">Login</Link>
          </button>
        )}


      </div>
    </div>
  );
}

export default Header;
