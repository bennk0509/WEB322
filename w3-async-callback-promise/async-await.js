function outputA() {
    let randomTime = Math.floor(Math.random() * 3) + 1;
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('A');
            resolve('A is completed');
          }, randomTime);
    })
}

function outputB() {
    let randomTime = Math.floor(Math.random() * 3) + 1;
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('B');
            resolve('B is completed');
          }, randomTime);
    })
}

function outputC() {
    let randomTime = Math.floor(Math.random() * 3) + 1;
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('C');
            resolve('C is completed');
          }, randomTime);
    })
}

async function showOutput()
{
    try {
        console.log(await outputA());
        console.log(await outputB());
        console.log(await outputC());   
    } catch (error) {
        console.log(error.message);      
    }
}

showOutput();