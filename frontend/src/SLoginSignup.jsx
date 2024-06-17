import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "./SLoginSignup.css"
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import Home_image from './assets/house-icon.png'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function SLoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loggedin, setIsloggedin] = useState(false);
  console.log(API_BASE_URL);
  const navigate =useNavigate();

  const data_send_to_backend = {
    email: email,
    password: password,
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, data_send_to_backend, { withCredentials: true });
      const data = await res.data;
      console.log("Received data:", res.data);

      const token_got =res.data.jwt;

   
      // console.log("Toek got->",token_got);
      // console.log(res.cookies);
      // console.log(res);
      // console.log(res.headers);
      if (data.errors) {
        console.log(data.errors);
        setEmailError(data.errors.email || '');
        setPasswordError(data.errors.password || '');
      } else {
        document.cookie = `jwt=${res.data.token}; path=/; secure; sameSite=None`;
        swal({title:"Logged in Successfully" , text:"Authenticated Successfully.",icon:"success"})
        .then((value) => {
          // navigate("/login");
          location.assign('/');
          setIsloggedin(true);
          
        });


      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log("Email ndaskfhis");
        const data = err.response.data;
        setEmailError(data.errors.email || '');
        setPasswordError(data.errors.password || '');
      } else {
        if (err.response && err.response.status === 404) {
          const data = err.response.data;
          setEmailError(data.errors.email || '');
        }
      }
    }
  };

  // Use useEffect to clear errors after 1 second when email or password changes
  useEffect(() => {
    if (emailError || passwordError) {
      const timer = setTimeout(() => {
        setEmailError('');
        setPasswordError('');
      }, 1000);

    }
  }, [emailError, passwordError]);


  function navigate_to_signup(){
      navigate('/signup');
  }

  function returnHome(){
    navigate('/');
  }

  return (
    <>
    <div className='home_icon'>
      <img className='home_image' onClick={returnHome} src={Home_image} alt="" />
    </div>

    <div className='auth-wrapper2'>
      <h1 className='log_title'>Login</h1>
      <form onSubmit={login}>
        <div className="container-auth-login">
          <label className='auth-label'>Email Id:</label>
          <input
            className='entry-auth'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            value={email}
            required
          />
          <div className="email error">{emailError}</div>
          <br />

          <label className='auth-label'>Password:</label>
          <input
            className='entry-auth'
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
      <div className='new_user' onClick={navigate_to_signup} >New to <span className='new_user_hai_kya'  > Crack the Code ?  </span> <span className='go_to_signup'>Signup</span> </div>
    </div>
    </>
  );
}

export default SLoginSignup;
