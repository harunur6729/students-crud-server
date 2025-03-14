const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app =express();
app.use(cors());
app.use(express.json());

// student-crud-project
//gggZSprj8hhtDhTt



const uri = "mongodb+srv://student-crud-project:gggZSprj8hhtDhTt@cluster0.6hlcc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const StudentsCollection = client.db("StudentsDB").collection("students");

    app.get('/students', async(req, res) =>{
      const cursor = StudentsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/students/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await StudentsCollection.findOne(query);
      res.send( result);
    })

    app.post('/students', async(req, res)=>{
      const student = req.body;
      console.log('new students', student);

      const result = await StudentsCollection.insertOne(student);
      res.send(result)

    })

    app.put('/students/:id', async(req, res)=>{
      const id = req.params.id;
      const student = req.body;
      console.log(student,id)

      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true};
      const updatedStudent ={
        $set:{
         name: student.name,
         className:student.className,
         roll:student.roll,
         father:student.father,
         mother:student.mother,
        }
      }

      const result = await StudentsCollection.updateOne(filter, updatedStudent, options);
      res.send(result)
    })

    app.delete('/students/:id', async(req, res)=>{
      const id = req.params.id;
      console.log('please delete from database', id);
      const query = {_id: new ObjectId(id) };
      const result = await StudentsCollection.deleteOne(query)
      res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('students simple crude ')
})

app.listen(port, ()=>{
    console.log(`student crud is running ${port}`)
})