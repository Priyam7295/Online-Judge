import React from "react";
import "./Model_PastSub.css";

function Modal({ show, handleClose, code }) {
  return (
    <div className={`modal ${show ? "show" : ""}  overall `}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <textarea value={code} readOnly />
      </div>
    </div>
  );
}

export default Modal;
