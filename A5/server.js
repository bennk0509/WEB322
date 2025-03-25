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

const { create } = require("domain");
const siteData = require("./modules/data-service");
const express = require("express");
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080; // assign a port
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
express.urlencoded({extended:true})
const app = express();
app.use(express.urlencoded({ extended: true })); // Built-in middleware for form data (key=value)
app.use(express.json()); // For parsing JSON data

const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_zJ7M6AoGIDBP', {
    host: 'ep-cool-scene-a5suh6mz-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });
  
app.set("view engine", "ejs");


// const Project = sequelize.define(
//     'Project',
//     {
//       project_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true, // use "project_id" as a primary key
//         autoIncrement: true, // automatically increment the value
//       },
//       title: Sequelize.STRING,
//       description: Sequelize.TEXT,
//     },
//     {
//       createdAt: false, // disable createdAt
//       updatedAt: false, // disable updatedAt
//     }
// );

// const ProvinceOrTerritory = sequelize.define(
//     'ProvinceOrTerritory',
//     {
//         code: {
//             type: Sequelize.STRING,
//             primaryKey: true,
//         },
//         name: Sequelize.STRING,
//         type: Sequelize.STRING,
//         region: Sequelize.STRING,
//         capital: Sequelize.STRING,

//     },
//     {
//         createdAt: false, // disable createdAt
//         updatedAt: false, // disable updatedAt
//     }
// )

// const Site = sequelize.define(
//     'Site', 
//     {
//         siteId: {
//             type: Sequelize.STRING,
//             primaryKey: true
//         },
//         site: Sequelize.STRING,
//         description: Sequelize.TEXT,
//         date: Sequelize.INTEGER,
//         dateType: Sequelize.STRING,
//         image: Sequelize.STRING,
//         location: Sequelize.STRING,
//         latitude: Sequelize.FLOAT,
//         longitude: Sequelize.FLOAT,
//         designated: Sequelize.INTEGER,
//         provinceOrTerritoryCode: Sequelize.STRING,
//     },
//     {
//         createdAt: false, // disable createdAt
//         updatedAt: false, // disable updatedAt
//     }
// );


// Site.belongsTo(ProvinceOrTerritory, {foreignKey: 'provinceOrTerritoryCode'})


// sequelize.sync().then(() => {
//     // create a new "Project" and add it to the database
//     Project.create({
//       title: 'Project1',
//       description: 'First Project',
//     })
//       .then((project) => {
//         // you can now access the newly created Project via the variable project
//         console.log('success!');
//       })
//       .catch((error) => {
//         console.log('something went wrong!');
//       });
//   },
// );
// Ensure the server starts only after siteData.initialize() completes
siteData.initialize().then(() => {
    app.get("/", (req, res) => {
        //res.send("Assignment 2: Khanh Anh Kiet Nguyen - 170049233");
        //res.sendFile(path.join(__dirname,"views","home.html"));
        res.render("home");
    });
    app.get("/about", (req, res) => {
        //res.send("Assignment 2: Khanh Anh Kiet Nguyen - 170049233");
        //res.sendFile(path.join(__dirname,"views","about.html"));
        res.render("about");
    });

    app.get("/sites", (req, res) => {
        const {region, provinceOrTerritory} = req.query;
        if(region){
            siteData.getSitesByRegion(region)
                .then(sites => res.render("sites", {sites}))
                .catch(error => 
                    //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                    res.status(404).render("404"));
        }else if(provinceOrTerritory)
        {
            siteData.getSitesByProvinceOrTerritoryName(provinceOrTerritory)
                .then(sites => res.render("sites", {sites}))
                .catch(error => 
                    //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                    res.status(404).render("404"));
        } else{
            siteData.getAllSites()
                .then(sites => res.render("sites", {sites}))
                .catch(error => 
                    //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                    res.status(404).render("404"));
        }
    });

    app.get("/sites/:siteId", (req, res) => {
        const { siteId } = req.params;

        siteData.getSiteById(siteId)
            .then(site => {
                if (!site) {
                    //return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
                    return res.status(404).render("404");
                }
                res.render("site",{site});
            })
            .catch(error => 
                //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                res.status(404).render("404"));
    });

    app.get("/sites/province-or-territory-demo", (req, res) => {
        siteData.getSitesByProvinceOrTerritoryName("ontar")
            .then(sites => res.render("sites", {sites}))
            .catch(error => 
                //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                res.status(404).render("404"));
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
                .catch(error => 
                    //res.status(404).sendFile(path.join(__dirname, "views", "404.html")));
                    res.status(404).render("404"));
    });


    app.get("/addSite",(req,res) => {
        siteData.getAllProvincesAndTerritories()
            .then( provincesAndTerritories => {
                res.render("addSite", { provincesAndTerritories: provincesAndTerritories })
            }).catch(error =>
                res.status(404).render("404"));
    })

    app.post("/addSite", (req,res) => {
        const siteAddedData = req.body;
        console.log(siteAddedData);
        siteData.addSite(siteAddedData)
            .then(() => {
            // Redirect to the /sites route on success
            res.redirect('/sites');
            })
            .catch((err) => {
            // Render the "500" view with the error message
            res.render('500', {
                message: `I'm sorry, but we have encountered the following error: ${err}`,
            });
        });
    })



    app.get("/editSite/:siteId",(req,res) => {
        const {siteId} = req.params;
        // Use Promise.all to handle both Promises simultaneously
        Promise.all([siteData.getSiteById(siteId), siteData.getAllProvincesAndTerritories()])
        .then(([site, provincesAndTerritories]) => {
            // Render the "edit" view with the resolved data
            res.render("editSite", { provincesAndTerritories: provincesAndTerritories, site: site });
        })
        .catch((err) => {
            // If any Promise is rejected, render the "404" view with the error message
            res.status(404).render("404", { message: err });
        });
    })

    app.post("/editSite", (req, res) => {
        const siteId = req.body.siteId;
        const siteUpdated = req.body; // Extract the "id" and the rest of the "siteData" from req.body
        // Call the editSite function with the "id" and "siteData"
        siteData.editSite(siteId, siteUpdated)
          .then(() => {
            // Redirect to "/sites" on successful update
            res.redirect("/sites");
          })
          .catch((err) => {
            // Render the "500" view with an error message on failure
            res.render("500", {
              message: `I'm sorry, but we have encountered the following error: ${err}`,
            });
          });
    });

    app.get("/deleteSite/:siteId", (req,res)=>{
        const siteId = req.params.siteId;
        console.log(siteId);
        siteData.deleteSite(siteId).then( () =>{
            res.redirect("/sites");
        })
        .catch((err) => {
            res.render("500", {
                message: `I'm sorry, but we have encountered the following error: ${err}`,
            });
        })
    })



    app.use(express.static(path.join(__dirname, 'public')));
    // Start the server
    app.listen(HTTP_PORT, () => {
        console.log(`Server running at http://localhost:${HTTP_PORT}`);
    });

    }).catch(error => {
        console.error("Failed to initialize site data:", error);
});
