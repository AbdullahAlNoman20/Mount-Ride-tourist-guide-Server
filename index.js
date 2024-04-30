const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())



// MongoDB DataBase Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdptwzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    // Where to put the data in Database
    const spotCollection = client.db('spotDB').collection('spot')
    const serviceCollection = client.db('spotDB').collection('service')


    // Edit Data OR Update
    app.get('/spot/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    // Find Single Data For Service Section
    app.get('/service/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })




    // Read of show data from server
    app.get('/spot',async(req, res) =>{
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Read of show data from server
    app.get('/country',async(req, res) =>{
      const cursor = spotCollection.find()
      const country = await cursor.toArray()
      res.send(country)
    })


    // Read of show data from server
    app.get('/service',async(req, res) =>{
      const cursor = serviceCollection.find()
      const service = await cursor.toArray()
      res.send(service)
    })



    // To Sent data From Clint Site
    app.post('/spot',async(req,res)=>{
      const newSpot = req.body;
      console.log(newSpot) 
      const result = await spotCollection.insertOne(newSpot)
      res.send(result);
    })


    // Update Data
    app.put('/spot/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedSpot = req.body;
      const Spot = {
        $set: {
      name: updatedSpot.name,
      email: updatedSpot.email,
      spotName:updatedSpot.spotName,
      photo:updatedSpot.photo,
      country:updatedSpot.country,
      location:updatedSpot.location,
      description:updatedSpot.description,
      cost:updatedSpot.cost,
      season:updatedSpot.season,
      time:updatedSpot.time,
      visitor:updatedSpot.visitor
        }
      }

      const result = await spotCollection.updateOne(filter,Spot,options)
      res.send(result)
    })



    // Delete operation
    app.delete('/spot/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server in running')
  })
  
  app.listen(port, () => {
    console.log(`Server in running on port ${port}`)
  })