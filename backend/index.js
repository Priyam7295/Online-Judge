const express = require('express');
const { DBConnection } = require("./database/db");
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authController = require('./controllers/authController');
const { requireAuth } = require('./middleware/authMiddleware');
const { useNavigate } = require('react-router-dom');
const generateFile = require('./CC/generateFile');
const executeCpp = require('./CC/executeCpp');
const executePy = require('./CC/executePy');
const generateInputFile = require('./CC/generateInputFile');
const generateExpectedOutputFile = require('./CC/generateExpectedOutput');
const PORT = 5000;

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require('./models/User');
const Problems = require('./models/Problems');


dotenv.config();

DBConnection();

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //we need to use this middleware for cookie

app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your React app's domain
    credentials: true, // This allows the server to accept cookies from the client
  })
);



app.set('view engine', 'ejs');


app.get('/', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
  // res.sendFile('P:\Project Online Judge\auth\frontend\src\app.jsx');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


app.get('/signup', authController.signup_get);
app.post('/signup', authController.signup_post);
app.get('/login', authController.login_get);
app.post('/login', authController.login_post);



app.get('/problems', requireAuth, authController.problems);
app.post('/problems_post', requireAuth, authController.postProb);


app.get('/problems_post', requireAuth, (req, res) => {
  res.json({ authenticated: true });
});




// get partivular problems
app.get('/problems/:id', requireAuth, authController.problem_details);


// sending cookie to the client , that is browser
app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 24 * 60, httpOnly: true });
  // httpOnly means cannot access cookie from the js from frontend . ie client cannot access it
  res.send("You got the cookies!");
});


// getting cookie when the request is made from the client to the server
app.get('/read-cookies', (req, res) => {

  const cookies = req.cookies;
  console.log(cookies);
  console.log(cookies.newUser);
  res.json(cookies);
});

app.get('/logout', (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'Lax' });
  // Send a response to the client
  res.status(200).json({ message: 'Logged out successfully' });
});




//  --------compiling the code---------

// ONLINE CODE COMPILER PART
app.post('/run', async (req, res) => {
  if (!req.body.language || !req.body.code) {
    return res.status(400).json({ success: false, error: "Language or code is missing in the request body." });
  }

  const { language, code, input } = req.body;

  try {
    // Store the user given code into a file
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    console.log(code);
    let output;
    if (language === 'cpp') {
      output = await executeCpp(filePath, inputPath);
    } else if (language === 'py') {
      output = await executePy(filePath, inputPath);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    res.json({ filePath, output });
  } catch (error) {
    if (error && error.message) {
      const errorMessage = error.message.toLowerCase(); // Convert to lowercase for case-insensitive matching
      if (errorMessage.includes('error') || errorMessage.includes('syntax error')) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }
    return res.status(500).json({ success: false, error: "Unknown error occurred" });
  }
});



//---=-==--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-SUBMITTING THE CODE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-
// =-=-=-=-=-=-=-=-==-=-=-==-==- Testing on various TC and giving the result --=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- 

const axios = require('axios');

// firebase admin  SDK for interacting with firebase services
const admin = require('firebase-admin');

// import the service account key JSON file required for firebase Admin SDK start
//  This file contains credentials for accessing Firebase Services.
const serviceAccount = require('./secKey.json');

// Initialize the Firebase Admin SDK with the service account credentials and the storage bucket URL.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'onlinej-68b38.appspot.com'
});
// Create a reference to the Firebase Storage bucket for storing files.
const bucket = admin.storage().bucket();

// this function generates  the signed URL , including version , expiry time
// signed URL gives temporary access to a URL and it can not be tampered by the user
// So, in summary, the signed URL is a modified version of the original URL with additional parameters appended to it, which are used for authentication and authorization purposes.
async function generateSignedUrl(filePath) {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3 * 1000 * 60 * 60, // 3 hour
  };
  const [url] = await bucket.file(filePath).getSignedUrl(options);
  return url;
}

async function fetchFileContent(url) {
  try {
    const response = await axios.get(url);
    const fileContent = response.data;
    return fileContent;
  } catch (error) {
    console.error('Error fetching the file from firebase:', error);
    throw error;
  }
}


//  ----------------------------------------------------------------

const compareOutputs = (userOutput, expectedOutput) => {
  const userLines = userOutput.trim().split('\n');
  const expectedLines = expectedOutput.trim().split('\n');

  if (userLines.length !== expectedLines.length) {
    return { success: false, error: 'Output length mismatched , Check what you are printing!!' };
  }

  const results = userLines.map((line, index) => {
    const expectedLine = expectedLines[index].trim();
    return {
      testCase: index + 1,
      passed: line.trim() === expectedLine,
      userOutput: line.trim(),
      expectedOutput: expectedLine,
    };
  });
  const allPassed = results.every(result => result.passed);

  return {
    success: allPassed,
    results: results,
  };
};

// ------------------------------------

// const jwt = require('jsonwebtoken');
app.post('/submit', async (req, res) => {
  // problemId: problem.problemID
  const { language, code, tcLink, ExpectedOutputLink, problemId } = req.body;
  // console.log(problemId, language, code, tcLink, ExpectedOutputLink);
  const token = req.cookies.jwt;
  console.log("Token", token);
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //id of user




  // Fetch user by userId
  const user = await User.findById(decodedToken.id);
  const prob = await Problems.findById(problemId);
  console.log(user);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }



  // console.log(req.body);


  // console.log(problemId);






  try {
    const tcFilePath = decodeURIComponent(tcLink.split('/o/')[1].split('?alt=media')[0]);
    const outputFilePath = decodeURIComponent(ExpectedOutputLink.split('/o/')[1].split('?alt=media')[0]);

    const tcSignedUrl = await generateSignedUrl(tcFilePath);
    const outputSignedUrl = await generateSignedUrl(outputFilePath);

    const testCases = await fetchFileContent(tcSignedUrl);
    const expectedOutput = await fetchFileContent(outputSignedUrl);



    try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(testCases);
      // const ExpectedOutputPath = await generateExpectedOutputFile(expectedOutput);
      const output = await executeCpp(filePath, inputPath);


      // So we got output as user=== user output
      // and expectedOutput as the Hardcoded corrert ouputs
      // Needs to match both txt file if same or not and return success or false`
      // check data type and value of both the file and return an object
      // retunn an object in which tell testcase 1 passed , testcase 2 passed , the momemnt any testcase fails , return to frontend
      // or if everything ok ,then 

      const comparisionResult = compareOutputs(output, expectedOutput);

      // console.log("User output" , output);
      // console.log('Expected OUTPUT FILE', expectedOutput);

      // output length didnot match
      if (!comparisionResult.success) {
        if (comparisionResult.error === 'Output length mismatched , Check what you are printing!!') {
          return res.status(400).json({
            success: false,
            error: comparisionResult.error,
          });
        }
      }


      if (!comparisionResult.success) {
        const firstFailure = comparisionResult.results.find(result => !result.passed);

        return res.status(400).json({
          success: false,
          error: `Test case ${firstFailure.testCase} failed`,
          first_failed: firstFailure.testCase,
          expected: firstFailure.expectedOutput,
          actual: firstFailure.userOutput,
        })
      }

      // console.log(problemId);
      // console.log(user.id);
      let earlierSolved =false;
      try {
        if (!user.solvedProblems.has(problemId)) {
          user.solvedProblems.set(problemId, true);
          await user.save();

          console.log("User saved successfully with updated solvedProblems");
          /////////////// UPDATING THE SOLVED PROBLEM COUNT BY USER /////////
          console.log(prob.difficulty);
          const probLevel =  prob.difficulty;
          if (probLevel === "easy" && user.easyP===0) {
            user.easyP += 1;
            user.save();
          }

          else if (probLevel === "basic" && user.basicP===0) {
            user.basicP += 1;
            user.save();
          }
          else if (probLevel ==="medium" && user.mediumP===0) {
            user.mediumP += 1;
            user.save();
          }
          else if(probLevel==="hard" && user.hardP===0) {
            user.hardP += 1;
            user.save();
          }



          /////////////////////////////////////////////////////////////
        } else {
          console.log("User already solved the problem:", problemId);

          earlierSolved=true;

        }
      } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ success: false, error: "Error saving user" });
      }

      // user.solvedProblems.set(problemId, true);
      // await user.save();

      const pass_to_user = { success: true, message: "All test cases passed!", results: comparisionResult.results , alreadySolved:false };
      if(earlierSolved){
        pass_to_user.alreadySolved =true;
      }
      res.status(200).json(pass_to_user);

      // console.log('User Output', output);
      // res.json({ filePath, output });
    } catch (error) {
      if (error && error.message) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('error') || errorMessage.includes('syntax error')) {
          return res.status(400).json({ success: false, error: error.message });
        }
      }
      return res.status(500).json({ success: false, error: "Unknown error occurred" });
    }



   


    // res.status(200).send('Received successfully');
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});




// --------  WHILE SHOWING PROBLEM LIST , CALL IS MADE TO SEE
//   IF PROB EARLIER SOLVED OR NOT

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(req);
  console.log(userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      // Return a 404 response if user not found
      
      return res.status(404).json({ error: 'User not found' });
    }

    // User found, return user data
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  
  }
});
