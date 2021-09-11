import express from 'express';
import cors from 'cors';
import {ObjectId} from 'mongodb'

const app = express();
require("dotenv").config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ae7d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allUsersCollection = client.db("user-management").collection("all-user");

  
  // perform actions on the collection object
  // client.close();


  // post newUser info
  app.post("/newUser", (req, res) => {
    const addUser = req.body;
    console.log(addUser, "addUser");
    allUsersCollection.insertOne(addUser)
    .then((result) => {
      console.log({result})
      res.send(!!result.insertedId)
    }).catch((err) => {
      console.log({err});
    })
  })

  // get allUsers info
  app.get("/allUsers", (req, res) => {
    allUsersCollection.find({}).toArray((err, items) => {
      res.send(items);
    })
  })

  // delete user info
app.delete("/userDelete/:id", (req, res) => {
  allUsersCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then((result) => {
    // console.log({result})
    res.send(result.deletedCount > 0)
  })
  .catch((err) => console.log({err}))
})

// update user info
app.put("/updateInfo/:id", (req, res) => {
  allUsersCollection.updateOne(
    {_id: ObjectId(req.params.id.toString())},
    { $set: { ...req.body }}
  )
  .then((result) => {
    res.send(!!result.modifiedCount);
  })
  .catch((err) => {
    res.send(err.message);
  })
})

});





app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })