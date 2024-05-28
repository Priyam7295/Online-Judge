// Header.js
import React from 'react';
import './HeaderLogin.css';
import {Link} from 'react-router-dom';
function Header({onLoginSignupClick}) {
  return (
    <div className="headerf">


      <div className="auth-buttons">

        


        <button className="contribute">
          <Link to='/problems_post'>Contribute</Link>
        </button>
        <button className="login-button">
        <Link to="/signup">SignUp</Link>
        </button>
        <p className='or' >or</p>
        <button className="signup-button" >
        <Link to="/login">Login</Link>
        </button>
      </div>
    </div>
  );
}

export default Header;
