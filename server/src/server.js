const http = require('http');
const app = require('./app');
const {mongoConnect} = require('./services/mongo')

const { loadPlanetData } = require('./models/planets.model');
const { loadlaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startPlanetServer() {
    await mongoConnect();
    await loadPlanetData();
    server.listen(PORT, () => {
        console.log(`listening to port ${PORT}...`)
    })
}

startPlanetServer();