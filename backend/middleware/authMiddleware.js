const jwt =require("jsonwebtoken")
const dotenv = require("dotenv");


dotenv.config();


const requireAuth = function(req , res , next){
    const token = req.cookies.jwt;
    console.log("token is",token);

    // check if token exists
    if(token){
        jwt.verify(token ,process.env.SECRET_KEY , (err , decodedToken) =>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{

        res.redirect('/login');
    }
}

module.exports={requireAuth};