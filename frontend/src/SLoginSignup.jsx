import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "./SLoginSignup.css"

function SLoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [cookies, setCookie] = useCookies(['token']);

  const [loggedin , setIsloggedin] = useState(false);

  const data_send_to_backend={
    email:email,
    password:password,
  };

  const login = async (e) => {
    
    e.preventDefault();
    try {
        
        const res = await axios.post('http://localhost:5000/login', data_send_to_backend, { withCredentials: true });
        const data= await res.data;
        console.log(res);
        if (data.errors) {
          console.log(data.errors);
            setEmailError(data.errors.email || '');
            setPasswordError(data.errors.password || '');
        }

        else{
            console.log("Login Successfully");
            setCookie('jwt', res.headers['set-cookie'], { path: '/' });
            setIsloggedin(true);
            location.assign('/');
        }

    }
    catch(err){
        if (err.response && err.response.status === 404) {
          console.log("Email ndaskfhis")
            const data = err.response.data;
            setEmailError(data.errors.email || '');
            setPasswordError(data.errors.password || '');
          } else {
            console.error('Error sending data', err);
          }
     }

    };

  return (
    <div className='auth-wrapper2'>
      <h1 className='log_title' >Login</h1>
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
    </div>
  )
}



export default SLoginSignup;
