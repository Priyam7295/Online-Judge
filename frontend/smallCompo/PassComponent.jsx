import React from 'react';
import './PassComponent.css'; // Import CSS file

function PassComponent({ totalTC }) {
  // Assuming totalTC is the number of test cases
  const testCases = Array.from({ length: totalTC }, (_, index) => ({
    id: index + 1,
    name: `Testcase ${index + 1}`,
    passed: true, // Assuming all test cases are passed
  }));

  return (
    <div>

      <div className="test-case-container">
        {testCases.map(tc => (
          <button
            key={tc.id}
            className="test-case-button passed"
          >
            {tc.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PassComponent;
