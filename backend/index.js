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
