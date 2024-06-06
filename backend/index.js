const express = require('express');
const { DBConnection } = require("./database/db");
const app=express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const authController = require('./controllers/authController');
const { requireAuth } = require('./middleware/authMiddleware');

const generateFile = require('./CC/generateFile');
const executeCpp = require('./CC/executeCpp');
const executePy = require('./CC/executePy');
const generateInputFile = require('./CC/generateInputFile');

const PORT=5000;

DBConnection();

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()) ; //we need to use this middleware for cookie

app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your React app's domain
    credentials: true, // This allows the server to accept cookies from the client
  })
);



app.set('view engine', 'ejs');


app.get('/',cors() ,(req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
    // res.sendFile('P:\Project Online Judge\auth\frontend\src\app.jsx');
  });
  
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});


app.get('/signup',authController.signup_get);
app.post('/signup',authController.signup_post);
app.get('/login', authController.login_get);
app.post('/login',authController.login_post);



app.get('/problems',requireAuth,authController.problems);
app.post('/problems_post',requireAuth ,authController.postProb);


app.get('/problems_post', requireAuth, (req , res) => {
  res.json({ authenticated: true });
});




// get partivular problems
app.get('/problems/:id' , requireAuth ,authController.problem_details);


// sending cookie to the client , that is browser
app.get('/set-cookies' , (req , res)=>{
  res.cookie('newUser',false);
  res.cookie('isEmployee',true , {maxAge:1000*60*24*60 , httpOnly:true});
  // httpOnly means cannot access cookie from the js from frontend . ie client cannot access it
  res.send("You got the cookies!");
});


// getting cookie when the request is made from the client to the server
app.get('/read-cookies' , (req , res)=>{

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

  const { language, code , input } = req.body;

  try {
      // Store the user given code into a file
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      console.log(code);
      let output;
      if (language === 'cpp') {
          output = await executeCpp(filePath , inputPath);
      } else if (language === 'py') {
          output = await executePy(filePath , inputPath);
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

const axios=require('axios');

// firebase admin  SDK for interacting with firebase services
const admin = require('firebase-admin'); 

// import the service account key JSON file required for firebase Admin SDK start
//  This file contains credentials for accessing Firebase Services.
const serviceAccount = require('./secKey.json');

// Initialize the Firebase Admin SDK with the service account credentials and the storage bucket URL.
admin.initializeApp({
  credential:admin.credential.cert(serviceAccount),
  storageBucket:'onlinej-68b38.appspot.com'
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
    expires: Date.now() + 3*1000 * 60 * 60, // 3 hour
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

app.post('/submit', async (req, res) => {
  const { language, code, tcLink, ExpectedOutputLink } = req.body;
  

  console.log(tcLink);
  console.log(ExpectedOutputLink);

  try {
    const tcFilePath = decodeURIComponent(tcLink.split('/o/')[1].split('?alt=media')[0]);
    const outputFilePath = decodeURIComponent(ExpectedOutputLink.split('/o/')[1].split('?alt=media')[0]);

    const tcSignedUrl = await generateSignedUrl(tcFilePath);
    const outputSignedUrl = await generateSignedUrl(outputFilePath);

    const testCases = await fetchFileContent(tcSignedUrl);
    const expectedOutput = await fetchFileContent(outputSignedUrl);



    try {
      const filePath =  await generateFile(language, code); 
      const inputPath = await generateInputFile(testCases);    
      const output = await executeCpp(filePath , inputPath);

      res.json({ filePath, output });
    } catch (error) {
      if (error && error.message) {
        const errorMessage = error.message.toLowerCase(); 
        if (errorMessage.includes('error') || errorMessage.includes('syntax error')) {
            return res.status(400).json({ success: false, error: error.message });
        }
      }
      return res.status(500).json({ success: false, error: "Unknown error occurred" });
    }



    console.log('TEST CASES FILE', testCases);
    console.log('OUTPUT FILE', expectedOutput);

    // res.status(200).send('Received successfully');
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal server error');
  }
});
