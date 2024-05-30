const path = require('path');
const User = require('../models/User');
const Problems = require('../models/Problems');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

module.exports.signup_get = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
}

dotenv.config();

// handling errors


const handleError = (err) => {
    console.log(err.message , err.code);
    let errors = {firstname:'',lastname:'',email:'' , password:''};

    // duplicate error code

    if(err.code ===11000){
        errors.email="That email is already registered";
        return errors;
    }

    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;

        });
    }

    // // incorrect email while login
    // if(){

    // }


    return errors;
}




// creating token 
const maxAge = 24*60*60; //takes in sec
const createToken = function(id){
    return jwt.sign({id} ,process.env.SECRET_KEY , {expiresIn:maxAge}) //payload , secret key , 
}


module.exports.login_get =(req , res)=>{
    res.sendFile(path.join(__dirname, '../views/login.html'));


}

// getting all problems
module.exports.problems = async (req , res)=>{
    try {
        const all_problems = await Problems.find();
        console.log(all_problems);
        // all_problems is an array in which each problem is an object
        res.status(200).send(all_problems);
    } catch (error) {
        console.log(error);
        res.status(500).send({"Error retreiving problems ": error});        
    }
    


}

// posting problems , can be done by me only 
module.exports.problems_post = async (req, res) => {
    console.log(req.body); // Log the received request body to check if testCases are included

    const { name, description, difficulty, testCases , tags , hints } = req.body;

    let errors = { name: '', description: '', difficulty: '', testCases: '' };

    if (!name) {
        errors.name = 'Enter Problem name';
        return res.status(400).json({ errors });
    }
    if (!description) {
        errors.description = 'Enter Problem description';
        return res.status(400).json({ errors });
    }
    if (!difficulty) {
        errors.difficulty = 'Enter the difficulty level';
        return res.status(400).json({ errors });
    }
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
        errors.testCases = 'Provide at least two test case';
        return res.status(400).json({ errors });
    }

    try {
        // Create the problem with test cases
        const createProblem = await Problems.create({ name, description, difficulty, testCases , tags , hints });
        console.log("Problem added successfully", createProblem);
        res.status(201).json({ createProblem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports.signup_post = async (req , res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    let password = req.body.password;

 

    // hashing password 
    let errors = {firstname:'',lastname:'',email:'' , password:'' };

    if (!password ) {
        errors.password='Enter your password';
        return res.status(400).json({errors});
    }

    if(password.length <6){
        errors.password='Password must be at least 6 characters long';
        return res.status(400).json({errors});
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    try {
        password=hashedPassword;
        const user = await User.create({firstname , lastname ,email ,password });
        const token =createToken(user._id);

        // place token inside cookie and send to client as response
        res.cookie('jwt' , token , {httpOnly:true , maxAge:maxAge*1000}); //cookie expoects in milliseconds
        console.log("Account created successfully");    
        res.status(201).json({user:user._id}); //in above line created account in db , now sending back to frontend  
    } 
    catch (error) {
        const errors =handleError(error);
        res.status(400).json({errors});
    } 
}


// const enteredPassword =bcrypt.compare(password, user.password)
// // res === true
// if(!enteredPassword){
// return res.status(400).send("Password doesnot match");
// }


module.exports.login_post = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

   let errors = {email:'' , password:''};

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            errors.email='Email is not registered';
            return res.status(404).json({ errors });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // Here you can create and return JWT or any other authentication logic
            errors.password='Enter correct password';
            return res.status(400).json({ errors });
        } 
        
        const token =createToken(user._id);

        // place token inside cookie and send to client as response
        res.cookie('jwt' , token , {httpOnly:true , maxAge:maxAge*1000}); //cookie expoects in milliseconds

        res.status(201).json({ user: user._id });
    }
    


    catch (err){
        const errors =handleError(err);
        // console.log(errors);
        res.status(400).json({errors});
        // res
    }


};


// logout
module.exports.logout_get =(req , res)=>{
    // changing the jwt to '' and with expiry time of 1 milliseconds
    res.cookie('jwt','' , {maxAge:1});
    res.redirect('/');
};



// Getting single problem
module.exports.problem_details = async (req, res) => {
    try {
        const prob_id = req.params.id;
        console.log(req.body);
        const prob = await Problems.findOne({ "_id": prob_id });

        console.log(prob);

        let to_send = {
            name: prob.name,
            description: prob.description,
            difficulty: prob.difficulty,
            testcase1:prob.testCases[0],
            testcase2:prob.testCases[1],
            tags:prob.tags , 
            hints:prob.hints,
        };

        res.json(to_send);
    } catch (error) {
        
        res.status(400).json({ message: "Internal server error" });
    }
}