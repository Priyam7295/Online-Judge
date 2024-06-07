import React from "react";
import "./HintsTab.css";
import {useState} from 'react'
import Think1 from "../src/assets/think2.jpg";
import Lock from "../src/assets/lock.png";

function HintsTab({ hints, onClose }) {

    const [usehints , setUsehints]=useState(false);
    
    function openHintsandDeductMarks(){
        setUsehints(true);
    }


  return (
    <div className="hints-overlay">
      <div className="hints-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="img_sec">
          <img src={Think1} alt="" />
        </div>
        <div className="warn_and_sugg">
          <img src={Lock} alt="Hints Click Here"  onClick={openHintsandDeductMarks}/>
          <p className='first_para'>We encourage you to solve yourself, if you fail then we have got you covered</p>
          <p className='second_para'> <span>NOTE-</span> Viewing HINTS will <span> deduct your Scores</span> based on difficulty of the problem</p>
        </div>
      </div>

      {usehints && (
            <div className='shown_hints'>{hints}</div>
            )}



    </div>
  );
}

export default HintsTab;

