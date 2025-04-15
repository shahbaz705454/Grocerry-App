require('dotenv').config();
console.log("📦 MONGODB_URI:", process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
console.error("❌ MongoDB URI is missing. Check your .env file.");
process.exit(1);
}
mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));
app.get('/', (req, res) => {
res.send('Hello, welcome to the server!'); 
});

// Server setup
app.listen(PORT, () => {
console.log(`✅ Server running on http://localhost:${PORT}`);
});


