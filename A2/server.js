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
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const app = express();


// Ensure the server starts only after siteData.initialize() completes
siteData.initialize().then(() => {
    
    app.get("/", (req, res) => {
        res.send("Assignment 2: Khanh Anh Kiet Nguyen - 170049233");
    });

    app.get("/sites", (req, res) => {
        siteData.getAllSites()
            .then(sites => res.json(sites))
            .catch(error => res.status(500).send(error));
    });

    app.get("/sites/site-id-demo", (req, res) => {
        siteData.getSiteById("ON016")
            .then(site => res.json(site))
            .catch(error => res.status(404).send(error));
    });

    app.get("/sites/province-or-territory-demo", (req, res) => {
        siteData.getSitesByProvinceOrTerritoryName("ontar")
            .then(sites => res.json(sites))
            .catch(error => res.status(404).send(error));
    });

    app.get("/sites/region-demo", (req, res) => {
        siteData.getSitesByRegion("prairie provinces")
            .then(sites => res.json(sites))
            .catch(error => res.status(404).send(error));
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
        console.log(`Server running at http://localhost:${HTTP_PORT}`);
    });

}).catch(error => {
    console.error("Failed to initialize site data:", error);
});
