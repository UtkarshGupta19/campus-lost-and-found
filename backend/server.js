const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Item = require('./models/Item');
const { calculateMatchScore } = require('./utils/matchingEngine');

const app = express();

// Standard CORS handles all OPTIONS preflights automatically
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Route 1: Post item + auto match
app.post('/api/items', async (req, res) => {
  console.log('📦 Data received:', req.body);
  try {
    const { title, description, category, type, location, date, contactEmail, imageUrl } = req.body;

    const newItem = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date: date ? new Date(date) : new Date(),
      contactEmail,
      imageUrl: imageUrl || ''
    });

    const oppositeType = type === 'lost' ? 'found' : 'lost';
    const existingOpposites = await Item.find({ type: oppositeType, status: 'active' });

    let matches = [];
    if (typeof calculateMatchScore === 'function') {
      matches = existingOpposites
        .map((candidate) => ({
          item: candidate,
          score: calculateMatchScore(newItem, candidate)
        }))
        .filter((entry) => entry.score >= 40)
        .sort((a, b) => b.score - a.score);
    }

    console.log(`✅ Item created! Found ${matches.length} matches.`);
    res.status(201).json({ item: newItem, matches });
  } catch (error) {
    console.error('❌ Error creating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route 2: Get all active items
app.get('/api/items', async (req, res) => {
  try {
    const { category, type, search } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) query.title = { $regex: search,$options: 'i' };

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route 3: Mark returned
app.patch('/api/items/:id/return', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, { status: 'returned' }, { new: true });
    res.json({ message: 'Item returned', item: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected successfully to MongoDB Atlas!');
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));