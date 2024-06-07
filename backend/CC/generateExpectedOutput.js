const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const dirExpectedOutputs = path.join(__dirname, 'ExpectedOutputs');


if (!fs.existsSync(dirExpectedOutputs)) {
    fs.mkdirSync(dirExpectedOutputs, { recursive: true });
}


const generateExpectedOutputFile = async (input) => {
    try {
        const jobID = uuid();
        const input_filename = `${jobID}.txt`;
        const input_filePath = path.join(dirExpectedOutputs, input_filename);

        console.log(`Writing to file: ${input_filePath}`);
        await fs.writeFileSync(input_filePath, input);
        console.log(`Successfully wrote to file: ${input_filePath}`);
        return input_filePath;
    } catch (error) {
        console.error('Error writing expected output file:', error);
        throw error;
    }
};


module.exports = generateExpectedOutputFile;