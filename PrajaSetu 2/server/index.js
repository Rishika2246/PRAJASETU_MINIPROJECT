const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

const STORE_PATH = path.join(__dirname, 'votes_store.json');

// Ensure store exists
if (!fs.existsSync(STORE_PATH)) {
  fs.writeFileSync(STORE_PATH, '[]');
}

app.post('/api/votes', (req, res) => {
  try {
    const vote = req.body;
    if (!vote) return res.status(400).json({ error: 'Missing vote payload' });

    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.push({ receivedAt: new Date().toISOString(), vote });
    fs.writeFileSync(STORE_PATH, JSON.stringify(arr, null, 2));

    console.log('Received vote payload, total stored:', arr.length);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to store vote:', err);
    res.status(500).json({ error: 'Failed to store vote' });
  }
});

app.get('/api/votes', (req, res) => {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    res.type('application/json').send(raw);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read store' });
  }
});

// Admin endpoints for comprehensive data access
app.get('/admin', (req, res) => {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8') || '[]';
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Votes Admin</title></head><body><h1>Stored Votes</h1><pre>${raw.replace(/</g,'&lt;')}</pre></body></html>`;
    res.type('text/html').send(html);
  } catch (err) {
    res.status(500).send('Failed to load admin');
  }
});

// Admin API endpoints
app.get('/api/admin/stats', (req, res) => {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8') || '[]';
    const votes = JSON.parse(raw);
    
    const stats = {
      totalVotes: votes.length,
      lastVoteTime: votes.length > 0 ? votes[votes.length - 1].receivedAt : null,
      firstVoteTime: votes.length > 0 ? votes[0].receivedAt : null,
      votesPerHour: calculateVotesPerHour(votes),
      systemStatus: 'online',
      serverUptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.get('/api/admin/votes/encrypted', (req, res) => {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8') || '[]';
    const votes = JSON.parse(raw);
    res.json({
      total: votes.length,
      votes: votes.map((vote, index) => ({
        id: index + 1,
        receivedAt: vote.receivedAt,
        encryptedData: {
          iv: vote.vote.iv,
          ciphertext: vote.vote.ciphertext.substring(0, 50) + '...' // Truncate for security
        },
        size: JSON.stringify(vote.vote).length
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get encrypted votes' });
  }
});

app.delete('/api/admin/votes', (req, res) => {
  try {
    fs.writeFileSync(STORE_PATH, '[]');
    res.json({ message: 'All votes cleared', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear votes' });
  }
});

function calculateVotesPerHour(votes) {
  if (votes.length === 0) return [];
  
  const hourlyData = {};
  votes.forEach(vote => {
    const hour = new Date(vote.receivedAt).getHours();
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
  });
  
  return Object.entries(hourlyData).map(([hour, count]) => ({
    hour: parseInt(hour),
    votes: count
  }));
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Demo votes server listening on http://localhost:${port}`));
