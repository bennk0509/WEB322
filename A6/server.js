/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*   Name: Khanh Anh Kiet Nguyen 
    Student ID: 170049233 
    Date: March 25th, 2025
    Website: https://web-322-5pi6.vercel.app/sites
*
********************************************************************************/

const { create } = require("domain");
const siteData = require("./modules/data-service");
const authData = require("./modules/auth-service");
const express = require("express");
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080; // assign a port
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');
const clientSessions = require('client-sessions');
require('dotenv').config();

express.urlencoded({extended:true})
const app = express();
app.set('views', __dirname + '/views');

//------------------------MIDDLEWARE------------------------------
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); // Built-in middleware for form data (key=value)
app.use(express.json()); // For parsing JSON data

app.use(
    clientSessions({
      cookieName: 'session', // this is the object name that will be added to 'req'
      secret: process.env.SECRET_STRING, // this should be a long un-guessable string.
      duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
      activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    })
);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });
  
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  }
  
  
app.set("view engine", "ejs");


// Ensure the server starts only after siteData.initialize() completes
siteData.initialize()
    .then(authData.initialize)
    .then(() => {
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


    app.get("/addSite",ensureLogin,(req,res) => {
        siteData.getAllProvincesAndTerritories()
            .then( provincesAndTerritories => {
                res.render("addSite", { provincesAndTerritories: provincesAndTerritories })
            }).catch(error =>
                res.status(404).render("404"));
    })

    app.post("/addSite",ensureLogin, (req,res) => {
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



    app.get("/editSite/:siteId",ensureLogin,(req,res) => {
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

    app.post("/editSite",ensureLogin, (req, res) => {
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

    app.get("/deleteSite/:siteId",ensureLogin, (req,res)=>{
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



    //================LOGIN SITE================

    app.get("/login",(req,res)=>{
        res.render("login",{ errorMessage: null} );
    })
    app.get('/register', (req, res) => {
        res.render('register', { successMessage: null, errorMessage: null });
    });

    app.post('/register', (req, res) => {
        authData.registerUser(req.body)
          .then(() => {
            res.render('register', {
              successMessage: 'User created'
            });
          })
          .catch(err => {
            res.render('register', {
              errorMessage: err,
              userName: req.body.userName,
              successMessage: ''
            });
          });
    });

    app.post('/login', (req, res) => {
        // Add User-Agent info to the request body
        req.body.userAgent = req.get('User-Agent');
      
        authData.checkUser(req.body)
          .then((user) => {
            // Save logged-in user to session
            req.session.user = {
              userName: user.userName,
              email: user.email,
              loginHistory: user.loginHistory
            };
            res.redirect('/sites');
          })
          .catch(err => {
            res.render('login', {
              errorMessage: err,
              userName: req.body.userName
            });
          });
      });

    app.get('/userHistory', ensureLogin, (req, res) => {

        if (!req.session.user) {
          return res.redirect('/login');
        }
        res.render('userHistory', {
          title: 'Your Login History'
        });
    });

    app.get('/logout', (req, res) => {
        req.session.reset(); // clear the session
        res.redirect('/');   // redirect to homepage
    });



    app.use(express.static(path.join(__dirname, 'public')));
    // Start the server
    app.listen(HTTP_PORT, () => {
        console.log(`Server running at http://localhost:${HTTP_PORT}`);
    });

    }).catch(error => {
        console.error("Failed to initialize site data:", error);
});
