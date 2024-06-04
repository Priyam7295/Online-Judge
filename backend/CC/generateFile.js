const fs = require('fs');
const path = require('path');
const {v4:uuid} =require('uuid');

const dirCodes =path.join(__dirname ,'codes');


// if already folder then do not create code folder
if(!fs.existsSync(dirCodes) ){
    fs.mkdirSync(dirCodes , {recursive:true});
}



const generateFile = (language , code)=>{
   const jobId=uuid();

   // creating file in which code will be there
   const filename = `${jobId}.${language}`;  //"1343e64d-8800-47cf-8c92-9a7732720acf.cpp"
   const filePath = path.join(dirCodes, filename);
   fs.writeFileSync(filePath ,code);
   return filePath;
};

module.exports = generateFile;