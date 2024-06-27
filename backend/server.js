// Import the required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();

// Define PORT for which server will listen to 
const PORT = process.env.PORT || 3001;

// MongoDB connection URL
const url = 'mongodb://localhost:27017'; 
const dbName = 'neurofeedback';

// Create a new MongoClient to connect to MongoDb
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

async function main() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // Specify the database to use
    const db = client.db(dbName);

    // Define a route for the root URL ("/")
    app.get('/', (req, res) => {
        res.send('Backend is running');
    });

    // Define a route to get EEG data
    app.get('/api/eeg-data', async (req, res) => {
      try {
        const collection = db.collection('eegData');
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // Define a route to add new EEG data
    app.post('/api/eeg-data', async (req, res) => {
      try {
        const collection = db.collection('eegData');
        const result = await collection.insertOne(req.body);
        res.status(201).send(result.ops[0]);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

    // Start the server and make it listen on the defined port
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
