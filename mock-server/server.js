const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.post('/auth/login', (req,res)=> { const { username } = req.body; return res.json({ token: `token-${username}`, refreshToken: `refresh-${username}`}); });
app.post('/auth/refresh', (req,res)=> { return res.json({ token: 'new-token-123' }); });
app.get('/admin/dashboard', (req,res)=> { return res.json({ stats: { users: 123, active: 45 } }); });
app.listen(3001, ()=> console.log('Mock server running on http://localhost:3001'));
