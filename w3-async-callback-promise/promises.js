function outputA(){
    let randomTime = Math.floor(Math.random()*3000) + 1;
    return new Promise((resolve, reject) => {
        if(randomTime)
        {
            setTimeout(() => {
                resolve("A");
            },2000);
        }
        else{
            reject("rejected");
        }
    })
}

function outputB(){
    let randomTime = Math.floor(Math.random()*3000) + 1;
    return new Promise((resolve, reject) => {
        if(randomTime)
        {
            setTimeout(() => {
                resolve("B");
            },randomTime);
        }
        else{
            reject("rejected");
        }
    })
}

function outputC()
{
    let randomTime = Math.floor(Math.random()*3000) + 1;
    return new Promise((resolve, reject) => {
        if(randomTime)
        {
            setTimeout(() => {
                reject("error!!!!");
                //after this will also continue
                console.log("After resolve or reject, it still continues!!")
            },randomTime);   
        }else{
            reject("rejected");
        }
    })
}


async function showOutput()
{
    try{
        let A = await outputA();
        console.log(A);
        let B = await outputB();
        console.log(B);
        let C = await outputC();
        console.log(C);
    } catch(err)
    {
        console.log(err);
    }
    
}
showOutput();