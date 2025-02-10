function greeting(name,callback)
{
  console.log(`Hello ${name}!!! Nice to see you!!!!!`);
  callback(name);
}

function goodbye(name){
  console.log(`Byeeeee ${name}!!!!!!`);
}

greeting("Khanh", goodbye);