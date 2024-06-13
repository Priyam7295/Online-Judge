const mongoose = require("mongoose");
const SubmissionSchema = new mongoose.Schema ({
    user_id:{
        type:String,
        required:true,
    },
    prob_id:{
        type:String,
        required:true,
    },
    prob_name:{
        type:String , 
        required:true,
    },

    submissions:[
        {
            language:{
                type:String,
                required:true,
            },
            code:{
                type:String,
                required:true,
            },
            verdict:{
                type:String ,
                required:true,
            },
            success:{
                type:Number ,
                required:true,
            },
            date:{
                type:Date,
                default:Date.now,
            }

        }
    ]

});

const Submission = mongoose.model("Submission",SubmissionSchema);
module.exports = Submission;
