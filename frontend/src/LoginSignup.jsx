import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "./LoginSignup.css"
import image from './assets/two.png'

import { useNavigate } from 'react-router-dom';
function LoginSignup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cookies, setCookie] = useCookies(['jwt']); 


  const navigate = useNavigate(); 
  const data_send_to_backend = {
    firstname,
    lastname,
    email,
    password,
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/signup', data_send_to_backend, { withCredentials: true });
      const data = res.data;
      if (data.errors) {
        setEmailError(data.errors.email || '');
        setPasswordError(data.errors.password || '');
      }
      if (data.user) {
        console.log('Data sent successfully');
        setCookie('jwt', res.headers['set-cookie'], { path: '/' });
        location.assign('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const data = err.response.data;
        setEmailError(data.errors.email || '');
        setPasswordError(data.errors.password || '');
      } else {
        console.error('Error sending data', err);
      }
    }
  };

  function navigate_to_login(){
    navigate('/login');
  }

  return (

    <div className="auth-wrapper">

      <form className="farm" onSubmit={submit}>
        <div className="sign_farm">SignUp</div>
        <div className="container-auth">

          <label className='auth-label'>First Name:</label>
      
          <input className='entry-auth'
            type="text"
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Enter your first name"
            value={firstname}
            required
          />
          <div className="firstname error"></div>
          <br />
          <label className='auth-label'>Last Name:</label>
          <input className='entry-auth'
            type="text"
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Enter your last name"
            value={lastname}
            required
          />
          <div className="lastname error"></div>
          <br />
          <label className='auth-label'>Email Id:</label>
          <input className='entry-auth'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            value={email}
          />
          <div className="email error">{emailError}</div>
          <br />
          <label className='auth-label'>Password:</label>
          <input className='entry-auth'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            value={password}
            required
          />
          <div className="password error">{passwordError}</div>
          <br />
          <input className='sub-btn' type="submit" value="Submit" />
        </div>
      </form>
      <div className='old_user' onClick={navigate_to_login} >New to <span className='old_user_hai_kya'  > Crack the Code ?  </span> <span className='go_to_login'> Login</span> </div>
    </div>
  );
}

export default LoginSignup;
