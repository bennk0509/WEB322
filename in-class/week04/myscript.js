const customer = require("./customer.js");
const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8080;

customer.setFullName("Khanh Anh Kiet Nguyen");
customer.setEmail("abcdef@gmail.com");
customer.addPhone("123-456-789");
customer.addPhone("789-456-123");

app.use(express.static(path.join(__dirname,"/public")));


app.get('/',(req,res)=>{
    res.send("ABCDEFGHKLMN");
})

app.get('/about',(req,res) => {
    res.send(customer.getFullName());
})



app.listen(HTTP_PORT, () => {console.log(`Listening on port ${HTTP_PORT}`)});





console.log(customer.getFullName());
console.log(customer.getEmail());
console.log(customer.getPhones());