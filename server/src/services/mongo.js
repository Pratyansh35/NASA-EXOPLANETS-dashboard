const mongoose = require('mongoose');


const MongoUrl = process.env.MONGO_URL;

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