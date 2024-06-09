import React from "react";

// Passed Button Component
const PassedButton = ({ onClick, index }) => {
  return (
    <button
      className="testcase-button passed"
      onClick={() => onClick(index)}
    >
      Testcase {index + 1}
    </button>
  );
};

// Failed Button Component
const FailedButton = ({ onClick, index }) => {
  return (
    <button className="testcase-button failed" onClick={() => onClick(index)}>
      Testcase {index + 1}
    </button>
  );
};

export { PassedButton, FailedButton };
