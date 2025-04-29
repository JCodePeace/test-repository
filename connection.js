const { MongoClient } = require('mongodb');
const uri = "";


module.exports = async function getDb() {
    const client = new MongoClient(uri);
    
    await client.connect();
    return client.db("new-application");
}