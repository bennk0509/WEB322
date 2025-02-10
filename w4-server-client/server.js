const siteData = require("./modules/data-service");
const express = require("express");
const path = require("path")
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const app = express();

siteData.initialize().then(()=>{
    app.use(express.static('./public'));
    app.get('/',(req,res) => {
        //res.send("Assignment 02: Khanh Anh Kiet Nguyen - 170049233");    
        res.redirect("/about");
    })

    app.get('/about',(req,res) => {
        res.sendFile(path.join(__dirname,"/views/about.html"));
    })

    app.listen(HTTP_PORT, () => console.log(`server listen on: http://localhost:${HTTP_PORT}`));
}).catch(error => {
    console.error("Failed to initialize site data:", error);
});
