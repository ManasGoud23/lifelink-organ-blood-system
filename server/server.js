const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, User, Inventory, Request } = require('./db');
const { Op } = require('sequelize');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Auth Routes ---
app.post('/api/register', async (req, res) => {
  try {
    const { phone, password, name, userType, location } = req.body;
    const uid = 'user_' + Date.now();
    const user = await User.create({ uid, phone, password, name, userType, location });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ where: { phone, password } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- User Management ---
app.get('/api/users', async (req, res) => {
  const { userType } = req.query;
  const where = userType ? { userType } : {};
  const users = await User.findAll({ where });
  res.json(users);
});

// --- Inventory Routes ---
app.get('/api/inventory', async (req, res) => {
  const { hospitalId } = req.query;
  const where = hospitalId ? { hospitalId } : {};
  const items = await Inventory.findAll({ where });
  res.json(items);
});

app.post('/api/inventory', async (req, res) => {
  try {
    const id = 'inv_' + Date.now();
    const item = await Inventory.create({ ...req.body, id });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Search Route (LOCATION BASED) ---
app.get('/api/search', async (req, res) => {
  const { bloodType, organType, location } = req.query;

  try {
    const inventoryWhere = {};
    if (bloodType) inventoryWhere.bloodType = bloodType;
    if (organType) inventoryWhere.organType = organType;

    // 1. Get all matching inventory
    // We'll join with User (Hospital) to filter by location
    const allMatches = await Inventory.findAll({
      where: inventoryWhere,
      include: [{
        model: User,
        where: { status: 'verified' }
      }]
    });

    // 2. Filter by searched location first
    let results = [];
    if (location) {
      const locationMatches = allMatches.filter(item =>
        item.User.location.toLowerCase().includes(location.toLowerCase())
      );

      // Limit to 4 for searched location
      results = locationMatches.slice(0, 4);

      // 3. Fallback: If less than 4 or empty, add from other locations
      if (results.length < 4) {
        const otherMatches = allMatches.filter(item =>
          !item.User.location.toLowerCase().includes(location.toLowerCase())
        );
        results = [...results, ...otherMatches.slice(0, 10 - results.length)];
      }
    } else {
      results = allMatches.slice(0, 10);
    }

    // Format for frontend
    const formatted = results.map(item => ({
      id: item.id,
      hospitalId: item.hospitalId,
      hospitalName: item.hospitalName || item.User.name,
      location: item.User.location,
      bloodType: item.bloodType,
      organType: item.organType,
      quantity: item.quantity,
      expiryDate: item.expiryDate
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Request Routes ---
app.get('/api/requests', async (req, res) => {
  const { patientId, hospitalId } = req.query;
  let where = {};
  if (patientId) where.patientId = patientId;
  if (hospitalId) where.hospitalId = hospitalId;

  const requests = await Request.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(requests);
});

app.post('/api/requests', async (req, res) => {
  try {
    const id = 'req_' + Date.now();
    const request = await Request.create({ ...req.body, id });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    await Request.update(req.body, { where: { id: req.params.id } });
    const updated = await Request.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:uid', async (req, res) => {
  try {
    await User.update(req.body, { where: { uid: req.params.uid } });
    const updated = await User.findByPk(req.params.uid);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SQL Backend running on port ${PORT}`);
  sequelize.authenticate().then(() => console.log('Database connected.'));
});
