const siteData = require("../data/NHSiteData");
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData");

let sites = [];


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
    return 
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
    getSitesByRegion
}