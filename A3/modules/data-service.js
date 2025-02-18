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


const siteData = require("../data/NHSiteData");
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData");

let sites = [];

// function initialize()
// {
//     siteData.forEach(site => {
//         const provinceOrTerritoryObj =  provinceAndTerritoryData.find((province) => province.code == site.provinceOrTerritoryCode);
//         const addedSite = {...site};
//         addedSite.provinceOrTerritoryObj = provinceOrTerritoryObj;
//         sites.push(addedSite);
//     });
// }

// function getAllSites()
// {
//     return sites;
// }

// function getSiteById(id){
//     return sites.find((sites) => sites.siteId = id)
// }

// function getSitesByProvinceOrTerritoryName(name)
// {
//     return sites.filter(site => site.provinceOrTerritoryObj.name.toLowerCase().includes(name.toLowerCase()));
// }

// function getSitesByRegion(region)
// {
//     return sites.filter(site => site.provinceOrTerritoryObj.region.toLowerCase().includes(region.toLowerCase()));
// }


function initialize()
{
    return new Promise((resolve) => {
        siteData.forEach(site => {
            const provinceOrTerritoryObj =  provinceAndTerritoryData.find((province) => province.code == site.provinceOrTerritoryCode);
            const addedSite = {...site};
            addedSite.provinceOrTerritoryObj = provinceOrTerritoryObj;
            sites.push(addedSite);
        });
        resolve();
    })
    
}

function getAllSites()
{
    return new Promise((resolve, reject) => {
        if (sites.length > 0) {
            resolve(sites);
        } else {
            reject("No site data available.");
        }
    });
}

function getSiteById(id){
    return new Promise((resolve,reject)=>
    {
        const site = sites.find((sites) => sites.siteId == id)
        if(site)
            resolve(site)
        else
            reject("unable to find requested site");
    })
}

function getSitesByProvinceOrTerritoryName(name)
{
    return new Promise((resolve,reject)=>{
        const site = sites.filter(site => site.provinceOrTerritoryObj.name.toLowerCase().includes(name.toLowerCase()));
        if(site.length > 0)
        {
            resolve(site);
        }
        else
            reject("unable to find requested site");
    })
}

function getSitesBySubRegionName(subRegionName)
{
    return new Promise((resolve, reject) => {
        const site = sites.filter(site => site.provinceOrTerritoryObj.subRegion.toLowerCase().includes(subRegionName.toLowerCase()));
        if(site.length > 0)
        {
            resolve(site);
        }
        else
            reject("unable to find requested site by sub-region");
    });
}
function getSitesByRegion(region)
{
    return new Promise((resolve,reject)=>{
        const site = sites.filter(site => site.provinceOrTerritoryObj.region.toLowerCase().includes(region.toLowerCase()));
        if(site.length > 0)
        {
            resolve(site);
        }
        else
            reject("unable to find requested site");
    })
}


module.exports = {
    initialize,
    getAllSites,
    getSiteById,
    getSitesByProvinceOrTerritoryName,
    getSitesByRegion,
    getSitesBySubRegionName
}