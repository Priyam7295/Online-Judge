const express = require('express');
const { DBConnection } = require("./database/db");
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authController = require('./controllers/authController');
const { requireAuth } = require('./middleware/authMiddleware');
const { useNavigate, useParams } = require('react-router-dom');
const generateFile = require('./CC/generateFile');
const executeCpp = require('./CC/executeCpp');
const executePy = require('./CC/executePy');
const generateInputFile = require('./CC/generateInputFile');
const generateExpectedOutputFile = require('./CC/generateExpectedOutput');
const fs = require('fs');
const { promisify } = require('util');
const PORT = 5000;
// const PORT = 8080;


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
    origin: ['https://online-judge-4ypq6yt.vercel.app', 'https://online-judge-4ypq6yt-git-master-priyams-projects-c7c3c963.vercel.app','https://online-judge-4ypq6yt-f1af3yd5t-priyams-projects-c7c3c963.vercel.app' ,'http://localhost:5174'], // Replace with your React app's domain
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
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true  });
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
      await promisify(fs.unlink)(filePath);
      await promisify(fs.unlink)(inputPath);

      try {
        // Delete the file containing the user's code
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      
        // Delete the file containing the test cases
        await fs.promises.unlink(inputPath);
        console.log(`Deleted file: ${inputPath}`);
      } catch (err) {
        console.error('Error deleting files:', err);
      }


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
    return res.status(500).json({ success: false, error: error });
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




const Submission = require('./models/Submissions');

async function AddSubmission(submission_data) {
  try {
    const { user_id, prob_id, language, code, verdict,  prob_name } = submission_data;

    const newSubmission = {
      language: language,
      code: code,
      verdict: verdict,
    
      prob_name: prob_name,
    };

    await Submission.updateOne(
      { user_id: user_id, prob_id: prob_id, prob_name: prob_name },
      { $push: { submissions: { $each: [newSubmission], $position: 0 } } },
      { upsert: true }
    );
    
    console.log('Submission data added successfully');
  } catch (error) {
    console.error('Error adding submission data:', error);
  }
}



// const jwt = require('jsonwebtoken');
app.post('/submit', async (req, res) => {
// problemId: problem.problemID
  const { language, code, tcLink, ExpectedOutputLink, problemId } = req.body;
  // console.log(problemId, language, code, tcLink, ExpectedOutputLink);
  const token = req.cookies.jwt;

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //id of user
  console.log("decoded Token is ", decodedToken);

  // user_id is==> decodedToken.id;


  // Fetch user by userId
  const user = await User.findById(decodedToken.id);
  const prob = await Problems.findById(problemId);
  console.log(user);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found ! Login to Submit Code' });
  }

  try {
    const tcFilePath = decodeURIComponent(tcLink.split('/o/')[1].split('?alt=media')[0]);
    const outputFilePath = decodeURIComponent(ExpectedOutputLink.split('/o/')[1].split('?alt=media')[0]);

    const tcSignedUrl = await generateSignedUrl(tcFilePath);
    const outputSignedUrl = await generateSignedUrl(outputFilePath);

    const testCases = await fetchFileContent(tcSignedUrl);
    const expectedOutput = await fetchFileContent(outputSignedUrl);


    // ////////////////////////////////////////////
    let add_in_his = {
      code: code,
      language: language,

      user_id: decodedToken.id,
      prob_id: problemId,
      prob_name: prob.name,
      success: 0,


    }
    try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(testCases);
      // const ExpectedOutputPath = await generateExpectedOutputFile(expectedOutput);
      const output = await executeCpp(filePath, inputPath);


      // to send to submission history blcok / / // / / / / /


      // So we got output as user=== user output
      // and expectedOutput as the Hardcoded corrert ouputs
      // Needs to match both txt file if same or not and return success or false`
      // check data type and value of both the file and return an object
      // retunn an object in which tell testcase 1 passed , testcase 2 passed , the momemnt any testcase fails , return to frontend
      // or if everything ok ,then 

      const comparisionResult= compareOutputs(output, expectedOutput);

      await promisify(fs.unlink)(filePath);
      await promisify(fs.unlink)(inputPath);
      // console.log("User output" , output);
      // console.log('Expected OUTPUT FILE', expectedOutput);

      try {
        // Delete the file containing the user's code
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      
        // Delete the file containing the test cases
        await fs.promises.unlink(inputPath);
        console.log(`Deleted file: ${inputPath}`);
      } catch (err) {
        console.error('Error deleting files:', err);
      }


      // output length didnot match
      if (!comparisionResult.success) {
        if (comparisionResult.error === 'Output length mismatched , Check what you are printing!!') {
          add_in_his.verdict = "Output length mismatched";
          add_in_his.success = 1;
          // 287
          await AddSubmission(add_in_his);
          return res.status(400).json({
            success: false,
            error: comparisionResult.error,
          });
        }
      }


      if (!comparisionResult.success) {
        const firstFailure = comparisionResult.results.find(result => !result.passed);
        add_in_his.verdict = `TC ${firstFailure.testCase} failed`;
        add_in_his.success = 0;
        await AddSubmission(add_in_his);
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
      let earlierSolved = false;
      try {
        const varia = await user.solvedProblems.has(problemId)
        if (!varia) {
          user.solvedProblems.set(problemId, prob.name);
          await user.save();

          console.log("User saved successfully with updated solvedProblems");
          /////////////// UPDATING THE SOLVED PROBLEM COUNT BY USER /////////
          console.log(prob.difficulty);
          const probLevel = prob.difficulty;
          if (probLevel === "easy" && user.easyP === 0) {
            user.easyP += 1;
            user.save();
          }

          else if (probLevel === "basic" && user.basicP === 0) {
            user.basicP += 1;
            user.save();
          }
          else if (probLevel === "medium" && user.mediumP === 0) {
            user.mediumP += 1;
            user.save();
          }
          else if (probLevel === "hard" && user.hardP === 0) {
            user.hardP += 1;
            user.save();
          }



          ////////////////////////////////////////////////////////////////////////////
        } else {
          console.log("User already solved the problem:", problemId);
          earlierSolved = true;

        }
      } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ success: false, error: "Error saving user" });
      }

      // user.solvedProblems.set(problemId, true);
      // await user.save();

      const pass_to_user = { success: true, message: "All test cases passed!", results: comparisionResult.results, alreadySolved: false };
      add_in_his.verdict = "PASSED";
      add_in_his.success = 1;
      await AddSubmission(add_in_his);
      if (earlierSolved) {
        pass_to_user.alreadySolved = true;
      }
      res.status(200).json(pass_to_user);

      // console.log('User Output', output);
      // res.json({ filePath, output });
    } catch (error) {

   
      add_in_his.verdict = "COMPILATION ERROR";
      add_in_his.success = 0;
      await AddSubmission(add_in_his);
      if (error && error.message) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('error') || errorMessage.includes('syntax error')) {


          return res.status(400).json({ success: false, error: error });
        }
      }


      return res.status(500).json({ success: false, error: error});
    }






    // res.status(200).send('Received successfully');
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});




// --------  WHILE SHOWING PROBLEM LIST , CALL IS MADE TO SEE -----------------------
//   IF PROB EARLIER SOLVED OR NOT //////////////////////////////////////////////////

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





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                 SHOW SUBMISSION LIST          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/your_submissions/:id", async (req, res) => {

  try {
    const { id } = req.params;
    console.log("Show the submission histroy");
    // console.log();
    const token = req.cookies.jwt;

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //id of user
    console.log("user id is ", decodedToken.id);
    const user_id = decodedToken.id;
    // const id=useParams();

    // Query the database to find submissions for the soecified user_id and id(prob_id)
    const submissions = await Submission.find({ user_id: user_id, prob_id: id });
    res.status(200).send(submissions);


  } catch (error) {
    console.log("Error fetching submissions", error);
    return res.status(500).json({ success: false, error: "Error Fetching Submissions" });
  }


})
// ///////////////// for my account page
app.get("/my_account" , authController.my_account);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CHECKING IF ADMIN OR NOT ////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/check_if_admin" ,async (req,  res)=>{
  const token =req.cookies.jwt;
  let to_send ={
    role:"",
    authorized:"",
  }
  try {
    const decodedToken= jwt.verify(token, process.env.SECRET_KEY);
    const user_id = decodedToken.id;
    console.log("USER ID IS--->",user_id);
    // const role = User.findById(user_id);
    const user =await User.findById(user_id);
    const role =user.role;
    to_send.role=role;
    to_send.authorized=true;
    res.json(to_send);

  } catch (error) {
      console.log("Error verfidying token ");
      to_send.authorized=false;
      res.json(to_send);
  }



});


////////////////////////////////////////////////////////////////////////////////////////

app.get("/query/problem/:tag", async (req, res) => {
  try {
    const { tag } = req.params; // Getting the tag from URL parameters
    console.log("Tag received in backend:", tag);

 
      const problems = await Problems.find({ tags: tag }).exec();
      console.log(problems);
      
      res.json(problems);


  } catch (error) {
    console.log("Error in backend:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
