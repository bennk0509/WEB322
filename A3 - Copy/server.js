/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Khanh Anh Kiet Nguyen Student ID: 170049233 Date: Feb 4th, 2025
*
********************************************************************************/

const siteData = require("./modules/data-service");
const express = require("express");
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const app = express();



// Ensure the server starts only after siteData.initialize() completes
siteData.initialize().then(() => {
    app.get("/", (req, res) => {
        //res.send("Assignment 2: Khanh Anh Kiet Nguyen - 170049233");
        res.sendFile(path.join(__dirname,"views","home.html"));
    });
    app.get("/about", (req, res) => {
        //res.send("Assignment 2: Khanh Anh Kiet Nguyen - 170049233");
        res.sendFile(path.join(__dirname,"views","about.html"));
    });

    app.get("/sites", (req, res) => {
        const {region, provinceOrTerritory} = req.query;
        if(region){
            siteData.getSitesByRegion(region)
                .then(sites => res.json(sites))
                .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
        }else if(provinceOrTerritory)
        {
            siteData.getSitesBySubRegionName(provinceOrTerritory)
                .then(sites => res.json(sites))
                .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
        } else{
            siteData.getAllSites()
                .then(sites => res.json(sites))
                .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
        }
    });

    app.get("/sites/:siteId", (req, res) => {
        const { siteId } = req.params;

        siteData.getSiteById(siteId)
            .then(site => {
                if (!site) {
                    return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
                }
                res.json(site);
            })
            .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
    });

    app.get("/sites/province-or-territory-demo", (req, res) => {
        siteData.getSitesByProvinceOrTerritoryName("ontar")
            .then(sites => res.json(sites))
            .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
    });

    //get all region
    app.get("/regions", (req, res) => {
            siteData.getAllSites()
                .then(sites => {
                    let uniqueRegions = [];
                    sites.map(site =>{
                        let region = site.provinceOrTerritoryObj.region;
                        if(!uniqueRegions.includes(region))
                        {
                            uniqueRegions.push(region);
                        }
                    });
                    res.json(uniqueRegions);
                })
                .catch(error => res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
    });

    app.use(express.static(path.join(__dirname, 'public')));
    // Start the server
    app.listen(HTTP_PORT, () => {
        console.log(`Server running at http://localhost:${HTTP_PORT}`);
    });

}).catch(error => {
    console.error("Failed to initialize site data:", error);
});
