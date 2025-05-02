const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://zahorodkopavlo:0Y7Ye5LxRIGtcw05@cluster0.oq9jm21.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = async function getDb() {
    const client = new MongoClient(uri);
    
    await client.connect();
    return client.db("new-application");
}