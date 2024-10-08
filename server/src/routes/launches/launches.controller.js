const {getAllLaunches,
        scheduleLaunch,
        existslaunchID,
        abortLaunchWithid
    } = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req,res){
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json( launches );
}



async function httpAddNewLaunch(req,res){
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
        return res.status(400).json({
            "error":"Values are missing"
        })
        
    }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(Date.parse(launch.launchDate))){
    return res.status(400).json({
            "error":"unknown format"
        })
    }
await scheduleLaunch(launch);
    return res.status(201).json(launch);
}


async function httpAbortLaunch(req,res){
    const launchid = Number(req.params.id);
    const existLaunch = await existslaunchID(launchid);
    if(!existLaunch){
        return res.status(401).json({
            error:"Launch not found"
        })
    }
    const aborted = await abortLaunchWithid(launchid);
    if(!aborted){
       return res.status(400).json({
        error:"couldn'd abort"
       });
    }
    return res.status(200).json({
        ok:true
    });
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};