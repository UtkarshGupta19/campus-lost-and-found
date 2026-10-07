import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    type: 'lost',
    location: 'CSE Block',
    date: '',
    contactEmail: '',
    imageUrl: ''
  });

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/items?type=${filterType}&search=${searchTerm}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filterType, searchTerm]);

  // Handle reporting an item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/items', formData);
      
      // If matching engine finds candidates, pop up the alert
      if (res.data.matches && res.data.matches.length > 0) {
        setMatches(res.data.matches);
      } else {
        alert('Item successfully reported!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Electronics',
        type: 'lost',
        location: 'CSE Block',
        date: '',
        contactEmail: '',
        imageUrl: ''
      });

      fetchItems();
    } catch (err) {
      alert('Error submitting report. Check backend console.');
    }
  };

  // Mark an item as returned
  const markReturned = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/items/${id}/return`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-indigo-600 tracking-wide">Campus Lost & Found</h1>
          <p className="text-xs text-slate-400">KCC Institute of Technology and Management</p>
        </div>
        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
          Team Nexus
        </span>
      </header>

      {/* Match Alert Notification Modal */}
      {matches.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl animate-in fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <h3 className="text-lg font-bold text-emerald-600">Possible Matches Detected!</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              The automated matching engine flagged items that correspond with your report:
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {matches.map(({ item, score }) => (
                <div key={item._id} className="border border-slate-200 p-3.5 rounded-xl flex justify-between items-center bg-slate-50">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      📍 {item.location} • 📅 {new Date(item.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">Contact: {item.contactEmail}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
                    {score}% Match
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMatches([])}
              className="mt-6 w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium cursor-pointer hover:bg-slate-800 transition"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Report Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <h2 className="text-base font-bold text-slate-800 mb-4">Report Item</h2>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status Type</label>
              <select
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Item Title</label>
              <input
                required
                className="w-full border border-slate-200 rounded-lg p-2.5"
                placeholder="e.g. Black JBL Headphones"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Electronics</option>
                <option>Documents/IDs</option>
                <option>Accessories</option>
                <option>Books/Stationery</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Campus Location</label>
              <input
                required
                className="w-full border border-slate-200 rounded-lg p-2.5"
                placeholder="e.g. CSE Block, 2nd Floor"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full border border-slate-200 rounded-lg p-2.5"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">College Email</label>
              <input
                type="email"
                required
                className="w-full border border-slate-200 rounded-lg p-2.5"
                placeholder="student@kccitm.edu.in"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
              <textarea
                required
                rows={2}
                className="w-full border border-slate-200 rounded-lg p-2.5"
                placeholder="Details like color, brand, scratch marks..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition cursor-pointer mt-2"
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* Right Column: Search & Live Item Feed */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by title (e.g. JBL, Bag)..."
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-grow text-sm shadow-xs focus:outline-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm shadow-xs"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Items</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
              No reports found. Submit a report using the form to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-base text-slate-900 mt-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                      <p>📍 {item.location}</p>
                      <p>📅 {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500 truncate max-w-[140px]">{item.contactEmail}</span>
                    <button
                      onClick={() => markReturned(item._id)}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Mark Returned
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}