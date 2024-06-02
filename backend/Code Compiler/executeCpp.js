
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// to store the output
const outputPath = path.join(__dirname, 'outputs');  //C:\Users\rajpr\Desktop\Online Compiler\backend\outputs

if (!fs.existsSync(outputPath)) {
    try {
        fs.mkdirSync(outputPath, { recursive: true });
        console.log(`Output directory ${outputPath} created successfully.`);
    } catch (error) {
        console.error(`Error creating output directory ${outputPath}:`, error);
    }
}

const executeCPP = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0]; //["2341402a-d6c6-408c-b8a9-9d63b3601ec9" ,"cpp"]
    const outputFilename = `${jobId}.exe`; //kjabhsdkjasbdasd.exe
    const outPath = path.join(outputPath, outputFilename);
      //C:\Users\rajpr\Desktop\Online Compiler\backend\outputs\2341402a-d6c6-408c-b8a9-9d63b3601ec9.exe

    return new Promise((resolve, reject) => {
        const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${outputFilename}`;
        console.log(`Executing command: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error:`, error);
                reject(`Execution error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.warn(`Execution stderr:`, stderr);
                reject(`Execution stderr: ${stderr}`);
                return;
            }

            resolve(stdout);
        });
    });
};

module.exports = executeCPP;


























