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
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(outputPath, outputFilename);

    return new Promise((resolve, reject) => {

        const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./${jobId}.out < "${inputPath}"`;
        console.log(`Executing command: ${command}`);

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error:`, error);
                reject(`Execution error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.warn(`Execution stderr:`, stderr);
                reject(stderr);
                return;
            }

            // Resolve with stdout
            resolve(stdout);

            // Delete .exe file after execution
            try {
                await deleteFile(outPath);
                console.log(`Deleted ${outPath} after execution.`);
            } catch (deleteError) {
                console.error(`Error deleting ${outPath}:`, deleteError);
            }
        });
    });
};

// Function to delete a file
async function deleteFile(filePath) {
    try {
        await fs.promises.unlink(filePath); // Deletes the file
    } catch (error) {
        throw new Error(`Error deleting file ${filePath}: ${error.message}`);
    }
}

module.exports = executeCPP;
