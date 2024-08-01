// server.js
require('dotenv').config(); // Ensure you have this at the top to load .env variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection (updated)
mongoose.connect(process.env.MONGO_URI, {
  // Remove deprecated options
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define a schema and model
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Item = mongoose.model('Item', ItemSchema);

// Route to handle POST requests
app.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to handle GET requests
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a health check route
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
