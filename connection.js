const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URL;

module.exports = async function getDb() {
    const client = new MongoClient(uri);
    
    await client.connect();
    return client.db("new-application");
}