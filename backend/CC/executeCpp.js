const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to store the output
const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    try {
        fs.mkdirSync(outputPath, { recursive: true });
        console.log(`Output directory ${outputPath} created successfully.`);
    } catch (error) {
        console.error(`Error creating output directory ${outputPath}:`, error);
    }
}

const executeCPP = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outputFilename = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFilename);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;
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
