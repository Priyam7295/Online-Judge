import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Graph.css"
function Graph({percentage , color , solved , total}) {

  const r =color.r;
  const b =color.b;
  const g =color.g;
  return (
    <div style={{ width: '100px', height: '100px' }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          rotation: 0.5,
          strokeLinecap: "butt",
          textSize: "19px",
          pathTransitionDuration: 0.9,
  
          pathColor: `rgba(${r}, ${b}, ${g}, ${percentage / 20})`,
          textColor: "gray",
          trailColor: "rgb(247, 244, 252)",
          backgroundColor: "#3e98c7",
        })}
      />
      <button className="report_Card">{solved}/{total  }</button>
    </div>
  );
}

export default Graph;
