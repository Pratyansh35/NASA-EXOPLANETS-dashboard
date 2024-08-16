const http = require('http');

require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./services/mongo')

const { loadPlanetData } = require('./models/planets.model');
const { loadlaunchData, loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startPlanetServer() {
    await mongoConnect();
    await loadPlanetData();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}...`)
    })
}

startPlanetServer();