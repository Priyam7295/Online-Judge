const express = require('express');
const { DBConnection } = require("./database/db");
const app=express();
const cookieParser = require('cookie-parser');
const path = require('path');

const cors = require('cors');


const PORT=5000;

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
const authController = require('./controllers/authController');
const { requireAuth } = require('./middleware/authMiddleware');


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
app.get('/logout',authController.logout_get );

app.get('/problems',requireAuth,authController.problems);

app.post("/problems_post" , requireAuth ,authController.problems_post);

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

