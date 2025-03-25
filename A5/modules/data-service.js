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

require('dotenv').config();

// const siteData = require("../data/NHSiteData");
// const provinceAndTerritoryData = require("../data/provinceAndTerritoryData");
// let sites = [];



const Sequelize = require('sequelize');

const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_zJ7M6AoGIDBP', {
    host: 'ep-cool-scene-a5suh6mz-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });

const ProvinceOrTerritory = sequelize.define(
    'ProvinceOrTerritory',
    {
        code: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        name: Sequelize.STRING,
        type: Sequelize.STRING,
        region: Sequelize.STRING,
        capital: Sequelize.STRING,

    },
    {
        createdAt: false, // disable createdAt
        updatedAt: false, // disable updatedAt
    }
)

const Site = sequelize.define(
    'Site', 
    {
        siteId: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        site: Sequelize.STRING,
        description: Sequelize.TEXT,
        date: Sequelize.INTEGER,
        dateType: Sequelize.STRING,
        image: Sequelize.STRING,
        location: Sequelize.STRING,
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
        designated: Sequelize.INTEGER,
        provinceOrTerritoryCode: Sequelize.STRING,
    },
    {
        createdAt: false, // disable createdAt
        updatedAt: false, // disable updatedAt
    }
);


Site.belongsTo(ProvinceOrTerritory, {foreignKey: 'provinceOrTerritoryCode'})


function initialize() {
    return new Promise((resolve, reject) => {
      sequelize
        .sync()
        .then(() => {
          console.log('Database synchronized successfully.');
        //   siteData.forEach((site) => {
        //     const provinceOrTerritoryObj = provinceAndTerritoryData.find(
        //       (province) => province.code === site.provinceOrTerritoryCode
        //     );
        //     const addedSite = { ...site };
        //     addedSite.provinceOrTerritoryObj = provinceOrTerritoryObj;
        //     sites.push(addedSite);
        //   });
          resolve(); // Resolve the Promise when done
        })
        .catch((error) => {
          console.error('Failed to synchronize database:', error);
          reject(error); // Reject the Promise with the error
        });
    });
  }


// function initialize()
// {
//     return new Promise((resolve) => {
//         siteData.forEach(site => {
//             const provinceOrTerritoryObj =  provinceAndTerritoryData.find((province) => province.code == site.provinceOrTerritoryCode);
//             const addedSite = {...site};
//             addedSite.provinceOrTerritoryObj = provinceOrTerritoryObj;
//             sites.push(addedSite);
//         });
//         resolve();
//     })
    
// }

function getAllSites() {
    return new Promise((resolve, reject) => {
      Site.findAll({
        include: [ProvinceOrTerritory], // Include the associated ProvinceOrTerritory model
      })
        .then((sites) => {
          resolve(sites); // Resolve the Promise with the returned sites
        })
        .catch((error) => {
          console.error('Error fetching sites:', error);
          reject(error); // Reject the Promise with the error
        });
    });
  }

function getSiteById(id){
    return new Promise((resolve,reject)=>
    {
        Site.findOne({
            where: {siteId: id},
            include: [ProvinceOrTerritory],
        }).then( (site) =>{
            if(site)
                resolve(site)
            else
                reject("unable to find requested site");
        }).catch((error) => {
            console.error('Error fetching site:', error);
            reject("An error occurred while fetching the site.");
        })        
    })
}

function getSitesByProvinceOrTerritoryName(provinceOrTerritory) {
    return new Promise((resolve, reject) => {
      Site.findAll({
        include: [ProvinceOrTerritory], // Include the associated ProvinceOrTerritory data
        where: {
          '$ProvinceOrTerritory.name$': {
            [Sequelize.Op.iLike]: `%${provinceOrTerritory}%`, // Filter using a case-insensitive substring match
          },
        },
      })
        .then((sites) => {
          if (sites.length > 0) {
            resolve(sites); // Resolve with the matching sites
          } else {
            reject('Unable to find requested sites'); // Reject if no sites are found
          }
        })
        .catch((error) => {
          console.error('Error fetching sites:', error);
          reject('An error occurred while fetching the sites'); // Reject with a generic error message
        });
    });
  }

// function getSitesBySubRegionName(subRegionName)
// {
//     return new Promise((resolve, reject) => {
//         const site = sites.filter(site => site.provinceOrTerritoryObj.subRegion.toLowerCase().includes(subRegionName.toLowerCase()));
//         if(site.length > 0)
//         {
//             resolve(site);
//         }
//         else
//             reject("unable to find requested site by sub-region");
//     });
// }

function getSitesByRegion(region) {
    return new Promise((resolve, reject) => {
      Site.findAll({
        include: [ProvinceOrTerritory], // Include the associated ProvinceOrTerritory data
        where: {
          '$ProvinceOrTerritory.region$': region, // Filter based on the ProvinceOrTerritory region
        },
      })
        .then((sites) => {
          if (sites.length > 0) {
            resolve(sites); // Resolve with the matching sites
          } else {
            reject('Unable to find requested sites'); // Reject if no sites are found
          }
        })
        .catch((error) => {
          console.error('Error fetching sites:', error);
          reject('An error occurred while fetching the sites'); // Reject with a generic error message
        });
    });
}


function addSite(siteData){
  return new Promise((resolve, reject) => {
    Site.create(siteData)
      .then(() => resolve()) // Resolve the promise without returning any data
      .catch((err) => {
        // Reject the promise with the first error's message for readability
        if (err.errors && err.errors.length > 0) {
          reject(err.errors[0].message);
        } else {
          reject("An error occurred while adding the site.");
        }
      });
  });
}
function getAllProvincesAndTerritories() {
    return new Promise((resolve, reject) => {
      ProvinceOrTerritory.findAll()
        .then((provincesAndTerritories) => {
          resolve(provincesAndTerritories); // Resolve with the list of provinces and territories
        })
        .catch((err) => {
          reject(`Unable to retrieve provinces and territories: ${err.message}`); // Reject with a meaningful error message
        });
    });
}

function editSite(id, siteData){
  return new Promise((resolve,reject) => {
    Site.update(
        siteData,
    {
      where: {siteId: id},
    }
    ).then(() => {
      console.log(`Update site ${id} successfully.`);
      resolve();
    }).catch((err) => {
      // Check if `err.errors` exists and contains at least one error
      if (err.errors && err.errors.length > 0) {
        reject(err.errors[0].message); // Use the first error message for better readability
      } else {
        reject(err.message || "An unknown error occurred while updating the site.");
      }
    });
  }) 
}

function deleteSite(id){
  return new Promise((resolve,reject) => {
    Site.destroy({
      where: {siteId: id},
    }).then(() => {
      console.log(`Delete site ${id} successfully.`);
      resolve();
    }).catch((err)=>{
      if (err.errors && err.errors.length > 0) {
        reject(err.errors[0].message); // Use the first error message for better readability
      } else {
        reject(err.message || "An unknown error occurred while updating the site.");
      }
    })
  })
}


module.exports = {
    initialize,
    getAllSites,
    getSiteById,
    getSitesByProvinceOrTerritoryName,
    getSitesByRegion,
    addSite,
    getAllProvincesAndTerritories,
    editSite,
    deleteSite
    // getSitesBySubRegionName
}

// Code Snippet to insert existing data from NHSiteData / ProvinceAndTerritoryData

// sequelize
//   .sync()
//   .then( async () => {
//     try{
//       await ProvinceOrTerritory.bulkCreate(provinceAndTerritoryData);
//       await Site.bulkCreate(siteData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sites" violates foreign key constraint "Sites_provinceOrTerritoryCode_fkey"

//       // it is because you have a "Site" in your collection that has a "provinceOrTerritoryCode" that does not exist in the "provinceAndTerritoryData".   

//       // To fix this, use PgAdmin to delete the newly created "ProvincesAndTerritories" and "Sites" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });

