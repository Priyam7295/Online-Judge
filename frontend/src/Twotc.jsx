import React, { useState, useEffect } from "react";
import axios from "axios";

function Twotc({ inputLink, outputLink }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  useEffect(() => {
    const fetchInputText = async () => {
      try {
        const inputResponse = await axios.get(inputLink);
        setInputText(inputResponse.data);
      } catch (error) {
        console.error("Error fetching input text:", error);
      }
    };

    const fetchOutputText = async () => {
      try {
        const outputResponse = await axios.get(outputLink);
        setOutputText(outputResponse.data);
      } catch (error) {
        console.error("Error fetching output text:", error);
      }
    };

    fetchInputText();
    fetchOutputText();
  }, [inputLink, outputLink]);

  return (
    <div>
      <h2>Input Testcases</h2>
      <pre>{inputText}</pre>
      <h2>Output Testcases</h2>
      <pre>{outputText}</pre>
    </div>
  );
}

export default Twotc;
