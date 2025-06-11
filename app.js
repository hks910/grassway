// app.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./models/db');

const webRoutes = require('./routes/web');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', webRoutes);

// Cek koneksi DB sebelum listen
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connected!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
})();
