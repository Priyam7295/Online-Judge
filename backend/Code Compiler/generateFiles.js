const fs = require('fs');

const path = require('path');
const {v4:uuid} = require('uuid');

const dirCodes = path.join(__dirname, 'Codes');

// if already Codes folder is presnet then do not create it

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes , {recursive:true});
}


const generateFile = (language , code)=>{
    const jobId = uuid();

    // craetiing file in which code will be there  example == priyam.cpp
    const filename = `${jobId}.${language}`;
    // eg akjdbakjs.cpp

    const filepath =path.join(dirCodes , filename);
    fs.writeFileSync(filepath, code);
    return filepath;
};

module.exports=generateFile;