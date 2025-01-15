//function to compare 2 elements
//return true if a > b
function compareFunction(a,b)
{
    return a > b;
}

//function to sort the list as reverse
//THIS FUNCTION WILL MODIFY THE LISTS
//THE DATA ISN'T LARGE => USE BUBBLE SORT FOR EASY IMPLEMENTATION
function sortedReverse(lists){
    let length = lists.length;
    for(let i = 0; i < length - 1;i++)
    {
        for(let j = 0; j < length - i - 1; j++)
        {
            if(compareFunction(lists[j],lists[j+1]))
                //swap 2 elements in a list
                lists[lists[j],lists[j+1]] = lists[lists[j+1],lists[j]];
        }
    }
    return lists;
}
//function ask user to input the name of the files
//using async and await

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

//Processing the Current Directory
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface(process.stdin,process.stdout);

fs.readdir(__dirname,(err,files) => {
    if(err)
        console.log(err.message);
    else{
        //use reverse method to reverse the order of each file in files
        files.reverse();
        //another way: implement the reverse list function
        //files = sortedReverse(files);
        console.log("Files & Folders in current folder (reverse alphabetical order):");
        i = 0;
        files.forEach(file => {
            console.log("\t",++i,":",file);
        })
    }
});


async function getFile() {
    try {
        const answer = await askFile("Enter a file or directory name from the list above:",files);
        console.log(`You selected: ${answer}`);
    } catch (err) {
        console.error(err);  // Error handling
    } finally {
        rl.close();  // Ensure to close the readline interface
    }
}
getFile();

