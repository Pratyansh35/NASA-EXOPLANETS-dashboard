const axios = require("axios");
const launchesdatabase = require("./launches.mongo");
const Planets = require("./planets.mongo");

const launch = {
  // comments are showing exact name of obj in SpaceX api
  flightNumber: 100, // flight_number
  mission: "kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), // date_local
  target: "Kepler-1652 b", // NA
  customers: ["Pratyansh", "NASA"], // payload.customers
  upcoming: true, // upcomming
  success: true, // success
};

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
//launches.set(launch.flightNumber,launch);
//saveLaunch(launch);

async function populateSpaceXapi() {
  console.log("Downloading launch data..");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if(response.status !== 200){
    console.log(`Problem at downloading data`);
    throw new Error(`Launch data download failed`);
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((playload) => {
      return playload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber}  ${launch.mission} ${launch.launchDate}`);
    await saveLaunch(launch);
  }
  
}

async function loadLaunchData() {
  const firstlaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
});
if (firstlaunch) {
    console.log(`data already loaded...`);
} else {
  await populateSpaceXapi();
}
}
async function findLaunch(filter) {
  return await launchesdatabase.findOne(filter);
}
async function existslaunchID(launchid) {
  return await findLaunch({
    flightNumber: launchid,
  });
}

async function getLatestFlightno() {
  const latestflight = await launchesdatabase.findOne().sort("-flightNumber");
  if (!latestflight) {
    return 99;
  }
  return latestflight.flightNumber;
}

async function getAllLaunches() {
  return await launchesdatabase
  .find({}, 
    { _id: 0, __v: 0 })
    //.skip(20)
    //.limit(50);
}

async function saveLaunch(launch) {
  await launchesdatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleLaunch(launch) {
  const planet = await Planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("invalid target planet");
  }
  const newLaunchNo = (await getLatestFlightno()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ISRO", "SpaceX"],
    flightNumber: newLaunchNo,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchWithid(launchid) {
  const aborted = await launchesdatabase.updateOne(
    {
      flightNumber: launchid,
    },
    {
      success: false,
      upcoming: false,
    }
  );
  console.log(aborted);
  console.log(aborted.acknowledged + "   " + aborted.modifiedCount);
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleLaunch,
  existslaunchID,
  abortLaunchWithid,
};
