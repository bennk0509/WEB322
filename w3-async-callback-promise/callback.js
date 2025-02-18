function calculateSum(displaySum)
{
  setTimeout(() =>
  {
    let sum = 5 + 3;
    displaySum(sum);
  },350)
}

function displaySum(sum)
{
  console.log(sum);
}


let sum = calculateSum(displaySum);