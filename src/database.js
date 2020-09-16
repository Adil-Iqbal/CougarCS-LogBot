require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://CougarCS-LogBot:${process.env.DB_USER_PASSWORD}@cougarcs-logbot.5iycm.mongodb.net/CougarCS-LogBot?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
