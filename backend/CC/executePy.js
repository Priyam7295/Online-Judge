const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    try {
        fs.mkdirSync(outputPath, { recursive: true });
        console.log(`Output directory ${outputPath} created successfully`);
    } catch (error) {
        console.error(`Error creating output directory ${outputPath}:`, error);
    }
}

const executePy = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outputFilename = `${jobId}.py`;
    const outPath = path.join(outputPath, outputFilename);

    return new Promise((resolve, reject) => {
        // Copy the Python file to the output directory
        fs.copyFile(filepath, outPath, (copyError) => {
            if (copyError) {
                console.error(`Error copying file to output directory:`, copyError);
                reject(`Error copying file: ${copyError.message}`);
                return;
            }

            // Read input from the input file
            fs.readFile(inputPath, 'utf8', (readError, inputData) => {
                if (readError) {
                    console.error(`Error reading input file:`, readError);
                    reject(`Error reading input file: ${readError.message}`);
                    return;
                }

                // Command to run the Python script with input from the file
                const command = `cd "${outputPath}" && python "${outputFilename}" < "${inputPath}"`;
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
        });
    });
};

module.exports = executePy;