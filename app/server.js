const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const mongoUrl = "mongodb://admin:password@mongodb:27017/user-account?authSource=admin";
const databaseName = "user-account";

const client = new MongoClient(mongoUrl);

async function start() {
  await client.connect();
  console.log("Connected to MongoDB");
}
start();

app.get('/get-profile', async (req, res) => {
  const db = client.db(databaseName);
  const user = await db.collection("users").findOne({ userid: 1 });
  res.json(user || {});
});

app.post('/update-profile', async (req, res) => {
  const db = client.db(databaseName);
  const user = req.body;
  user.userid = 1;

  await db.collection("users").updateOne(
    { userid: 1 },
    { $set: user },
    { upsert: true }
  );

  res.json(user);
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
