require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://CougarCS-LogBot:${process.env.DB_USER_PASSWORD}@cougarcs-logbot.5iycm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const dbClient = new MongoClient(uri, { useNewUrlParser: true });
dbClient.connect(async (err) => {

    // TODO: Implement try, catch, finally.
    // TODO: Integrate with index.js
    
  const collection = await dbClient.db("log").collection("data");
  const result = await collection.insertOne({
    "name": "Thomas Jefferson",
    "date": "1776-07-04T05:50:36.000Z",
    "volunteer type": "group",
    "duration": 1.75,
    "comment": "declared independence"
});
console.log(result.insertedId);
await dbClient.close();
});
