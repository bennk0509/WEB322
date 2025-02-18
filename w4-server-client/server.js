const siteData = require("./modules/data-service.js");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const path = require("path");



siteData.initialize().then(()=>{
    app.set('views', __dirname + '/views');
    app.use(express.static(path.join(__dirname,"/public")));

    app.get('/',(req,res) => {
        res.send("Khanh Anh Kiet Nguyen - 170049233 - Assignment02");
    })

    app.get('/about',(req,res) => {
        siteData.getAllSites().then(
            (site) => {
                res.json(site)
            }
        ).catch(
            err => {
            res.status(500).send(err);
        })
    })
    app.get('/about/id-demo',(req,res) => {
        siteData.getSiteById("ZZZ").then(
            site => {res.json(site);}
        ).catch(
            err => {res.status(500).send(__dirname);}
        )
    })

    app.get('/about/province-demo', (req,res) =>{
        siteData.getSitesByProvinceOrTerritoryName("On").then(
            sites => {
                res.json(sites);
            }
        ).catch(
            err => {
                res.status(500).send(err);
            }
        )
    })

    app.listen(HTTP_PORT,() => {console.log(`Listen on http://localhost:${HTTP_PORT}`)});

}).catch(error => {
    console.error("Failed to initialize site data:", error);
});
