const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Electronics', 'Documents/IDs', 'Accessories', 'Books/Stationery', 'Other'],
    required: true 
  },
  type: { type: String, enum: ['lost', 'found'], required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  contactEmail: { type: String, required: true },
  status: { type: String, enum: ['active', 'returned'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);