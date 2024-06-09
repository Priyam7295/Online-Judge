import React, { useState, useEffect } from "react";
import app from "./firebase.js";
import "./Upload.css"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Define the variables to store download links
let TestcasesDownloadLink = "";
let OutputsDownloadLink = "";

function Upload() {
  const [testcases, setTestcases] = useState(undefined);
  const [outputs, setOutputs] = useState(undefined);
  const [tcperc, setTcperc] = useState(0);
  const [outperc, setOutperc] = useState(0);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    testcases && uploadFile(testcases, "testcasesUrl");
  }, [testcases]);

  useEffect(() => {
    outputs && uploadFile(outputs, "outputsUrl");
  }, [outputs]);

  const uploadFile = (file, fileType) => {
    const storage = getStorage(app);
    const folder =
      fileType === "testcasesUrl" ? "Alltestcases/" : "Alloutputs/";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === "testcasesUrl"
          ? setTcperc(Math.round(progress))
          : setOutperc(Math.round(progress));
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Download URL --", downloadURL);
          setInputs((prev) => {
            return {
              ...prev,
              [fileType]: downloadURL,
            };
          });
          // Set the download link variables accordingly
          if (fileType === "testcasesUrl") {
            TestcasesDownloadLink = downloadURL;
          } else {
            OutputsDownloadLink = downloadURL;
          }
        });
      }
    );
  };

  return (
    <div className="upload">
      <form>
        <div>
          <label className="upload_heading" htmlFor="testcases">TESTCASES:</label>{" "}
          {tcperc && "Uploading " + tcperc + "%"}
          <br />
          <input
            type="file"
            name="testcases"
            id="testcases"
            onChange={(e) => setTestcases(e.target.files[0])}
          />
        </div>
        <div>
          <br />
          <div>
            <label className="upload_heading" htmlFor="outputs">Output:</label>{" "}
            {outperc && "Uploading " + outperc + "%"}
            <br />
            <input
              type="file"
              name="outputs"
              id="outputs"
              onChange={(e) => setOutputs(e.target.files[0])}
            />
          </div>
          <br />
          {/* <button type="submit">Upload</button> */}
        </div>
      </form>
    </div>
  );
}

export default Upload;
export { TestcasesDownloadLink, OutputsDownloadLink };
