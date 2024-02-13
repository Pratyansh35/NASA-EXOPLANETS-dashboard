const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require('./planets.mongo')

const result = [];

function isHabitable(planet){
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
async function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,'..','..','data','kapler_data.csv'))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }))
      .on("data", async (data) => {
        if (isHabitable(data)) {
        savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planetcount =  (await getAllPlanets()).length
        console.log(`${planetcount} are total habitable planets found`);
        resolve();
      });
  });
}

async function getAllPlanets(){
  return await planets.find({},
    {'_id': 0,
  "__v":0});
}

async function savePlanet(data){
    try{await planets.updateOne({
      keplerName: data.kepler_name,
    },{
      keplerName: data.kepler_name,
    },{
      upsert: true,
    });}
    catch(err){
      console.error(`Coundn't not save ${err}`)
    }
}
module.exports = {
  loadPlanetData,
  getAllPlanets
};
