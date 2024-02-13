const mongoose = require('mongoose');

const MongoUrl = 'mongodb+srv://nasa-api:qYR7G5D5yAX4z0za@nasacluster.rivucwa.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once('open' ,() =>{
    console.log('Mongos Connection is ready');
})
mongoose.connection.on('error' ,(err) =>{
    console.log(`Mongos Connection fails ${err}`);
})

async function mongoConnect(){
    await mongoose.connect(MongoUrl);
}
async function mongoDisconnect(){
    await mongoose.disconnect();
}
module.exports = {
    mongoConnect,
    mongoDisconnect
}