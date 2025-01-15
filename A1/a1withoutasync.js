const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface(process.stdin,process.stdout);
const path = require('path');



/**
 * Function to read files in directory and return a promise
 * 
 * @return will return a promise, (resolve, reject) = (files, err)
 */
function readFiles()
{
    return new Promise((resolve,reject) => {
        const files = fs.readdir(__dirname ,(err,files) => {
            if(err)
                reject(err);
            resolve(files);
        });
    })
}


/**
 * Ask the user input and check if the input is in the list of files or not
 * 
 * @param {string} question - The question which will display into the screen.
 * @param {string} listFiles - The list of files finding in above function
 * @return also return the promise (resolve, reject) = (the fileName if exists in the list, error message)
 */

function askFile(question,listFiles)
{
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            //check if answer is in list or not
            if(listFiles.includes(answer))
                resolve(answer);
            else{
                reject("DJT ME DEO CO TRONG MANG, DEBUG DI THANG MAT LOZ");
            }
        } )
    })
}


/**
 * display every files inside the directory with the reverse order
 * 
 * @param {list} files - A list of files that found in the current directory
 * @return return nothing, just display function.
 * Sample output:
 *      1: test.html
        2: tempCodeRunnerFile.js
        3: solar.txt
        4: planets
        5: package.json
        6: package-lock.json
        7: node_modules
        8: milky-way.txt
        9: a1withoutasync.js
        10: a1.js
 */
function displayFiles(files)
{
    let i = 0;
    files.reverse();
    files.forEach(file => {
        console.log(`\t${++i}: ${file}`); 
    });   
}


/**
 * display information that got from file
 * 
 * @param {string} fileName - A name of file
 * @param {string} longestWord - The longest word that can be found in this file
 * @param {number} numCharacter - A number of character including space
 * @param {number} numWords - A number of words inside this file
 * @return return nothing, just display function.
 * Sample output with input solar.txt:
 *      File Name: solar.txt
        Number of Characters (including spaces): 1635
        Number of Words: 274
        Longest Word: gravitational
 */
function displayInformation(fileName,longestWord, numCharacter, numWords)
{
    console.log(`File Name: ${fileName}`);
    console.log(`Number of Characters (including spaces): ${numCharacter}`);
    console.log(`Number of Words: ${numWords}`);
    console.log(`Longest Word: ${longestWord}`);
}


/**
 * Function to process even if the path if file or folder
 * Add full path include the current directory and the file Name
 * Check if this path is file or directory
 * IF THIS PATH IS FILE => read all information abouut this FILE
 * ELSE => DISPLAY FILE INSIDE THIS DIRECTORY EXCEPT CHILD FOLDER
 * 
 * @param {string} fileName - A name of file
 * @return return nothing, just processing function.
 */
const processFileAndFolder = (fileName) => {
    try {
        const fullPath  = path.join(__dirname,fileName);
        let stat = fs.statSync(fullPath);
        if(stat.isFile())
        {
            const fileContent = fs.readFileSync(fullPath,'utf-8').toString().replace(/\s+/g, ' ');
            let numCharacter = fileContent.length;
            let arrayWords = fileContent.replace(/[^\w\s\']/g, "").split(' ');
            const sortedWords = arrayWords.sort(function(a,b) {return b.length - a.length;});
            displayInformation(fileName,sortedWords[0],numCharacter,arrayWords.length);
        }
        else{
            processFolder(fileName);
        }
    } catch (error) {
        console.log(error);
    }
};


/**
 * A child function to process if the filename is directory
 * ELSE => DISPLAY FILE INSIDE THIS DIRECTORY EXCEPT CHILD FOLDER
 * 
 * @param {string} fileName - A name of file
 * @return return nothing, just processing function.
 */
const processFolder = (fileName) => {
    const fullPath  = path.join(__dirname,fileName);
    directoryContent = fs.readdirSync(fullPath);
    const fileInsideDirectory = directoryContent.filter(elem=>{
        return fs.statSync(path.join(fullPath,elem)).isFile();
    }).reverse();
    console.log(`Files in the "${fileName}" folder (reverse alphabetical order):`);
    console.log(" ",fileInsideDirectory.join(', '));
}



//main function START HERE
async function main()
{
    try {
        files = await readFiles();
        displayFiles(files);

        const answer = await askFile("Enter a file or directory name from the list above:",files);
        processFileAndFolder(answer);

    } catch (error) {
        console.log(error);
    }
    finally{
        rl.close();
    }
}

main()