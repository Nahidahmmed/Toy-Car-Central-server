const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




// mongodb 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ht72zna.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();



        const CarToyCollection = client.db('car').collection('carServices');
        const AddedToyCollection = client.db('AddedToyCar').collection('AddedToyCarServices');
      
  

        app.get('/newcars', async(req,res) =>{
            const cursor = CarToyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/addedToys', async (req, res) => {
            console.log(req.query.sellerEmail);
            let query = {};
            if(req.query?.sellerEmail){
                query = {sellerEmail: req.query.sellerEmail}
            }
            const cursor = AddedToyCollection.find(query).limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        
        app.get('/addedToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await AddedToyCollection.findOne(query);
            res.send(result)
        })


        app.post("/addedToys", async (req, res) => {
            const data = req.body;
            const result = await AddedToyCollection.insertOne(data);
            if (result.insertedId !== undefined) {
                res.send({
                    success: true,
                    message: "Toy was successfully created"
                });
            } else {
                res.send({ success: false, message: "something is wrong" })
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Assignment 11 is running')
})

app.listen(port, () => {
    console.log(`assignment 11 is on${port}`);
})