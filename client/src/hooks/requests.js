const httpapi = 'http://localhost:8088/v1';
// TODO: Once API is ready.
// Load planets and return as JSON.
async function httpGetPlanets() {
  
  const respond = await fetch(`${httpapi}/planets`);
  return await respond.json();

}

// Load launches, sort by flight number, and return as JS
async function httpGetLaunches() {
  const respond = await fetch(`${httpapi}/launches`);
  const launchesData = await respond.json();
  return launchesData.sort((a,b)=>{
    return a.flightNumber - b.flightNumber;
  })
   
}

async function httpSubmitLaunch(launch) {
  try{
  return await fetch(`${httpapi}/launches`,{
    method:"post",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify(launch)
  })}
  catch(err){
    return{
      ok :false
    };
  }
}

async function httpAbortLaunch(id) {
  try{return await fetch(`${httpapi}/launches/${id}`,{
    method:"delete",
  });}catch(err){
    console.log(err);
    return {
      ok: false
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};