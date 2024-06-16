import React from 'react'
import gifImage from './assets/coder.gif'
import './coder.css'
import {Link} from 'react-router-dom'
import swal from 'sweetalert';
import {useNavigate} from 'react-router'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function Intro_Website() {
  const navigate = useNavigate();

  function go_to_prob_list(){
    navigate("/problems")

  }
  return (
    <div className="coder-image" >
      <div className="entry" >
        <div>
         <h1 className="tagline" >Crack the Code!</h1>
          <div className="description">
            <h1 className='oneliner' >"Crack the Code: Where Challenges Fuel Your Coding Journey."</h1>
            <br />
            <h1>Welcome to Crack the code, where coding challenges transform into solutions! Whether you're a seasoned developer honing your skills or a beginner taking your first steps into the world of coding, we have something for everyone.</h1>
            <button className="solverButton">
            <div onClick={go_to_prob_list}>Start Solving</div>
            </button>
          </div>
        </div>
      </div>

      <div className="entry">
        <img src={gifImage} alt="GIF" />
      </div>
   
    </div>
  )
}

export default Intro_Website