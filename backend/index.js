const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/ping', (req, res) => res.send('pong'));
app.get('/dummy', (req, res) => res.json({ message: 'Texto de exemplo vindo da API!' }));
app.listen(3000, () => console.log('API rodando na porta 3000'));