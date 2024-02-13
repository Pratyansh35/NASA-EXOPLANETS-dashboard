const axios = require('axios');
const launchesdatabase = require('./launches.mongo');
const Planets = require('./planets.mongo');


const launch = {
    flightNumber: 100,
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-1652 b',
    customers: ['Pratyansh','NASA'],
    upcoming: true,
    success: true
};

const SPACEX_API_URL = "";
//launches.set(launch.flightNumber,launch);
saveLaunch(launch);
async function loadLaunchData(){
    console.log('Downloading launch data..');
    await axios.post();
}
async function existslaunchID(launchid){
    return  await launchesdatabase.findOne({
        flightNumber: launchid,
    })
}

async function getLatestFlightno(){
    const latestflight = await launchesdatabase.findOne().sort('-flightNumber');
    if(!latestflight){
        return 99;
    }
    return latestflight.flightNumber;
}



async function getAllLaunches(){
    return await launchesdatabase.find({},
        {'_id' : 0, '__v': 0});
}

async function saveLaunch(launch){
    const planet = await Planets.findOne({
        keplerName: launch.target,
    })

    if(!planet){
        throw new Error('invalid target planet');
    }

    await launchesdatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert:true
    })
}


async function scheduleLaunch(launch){
    const newLaunchNo = await getLatestFlightno() + 1;

    const newLaunch = Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ISRO','SpaceX'],
        flightNumber:newLaunchNo
    });
    await saveLaunch(newLaunch);
}


async function abortLaunchWithid(launchid){
    const aborted =  await launchesdatabase.updateOne({
        flightNumber:launchid
    },{  
    success : false,
    upcoming : false
});
console.log(aborted);
console.log(aborted.acknowledged +'   ' + aborted.modifiedCount);
return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,  
    getAllLaunches,
    scheduleLaunch,
    existslaunchID,
    abortLaunchWithid
};