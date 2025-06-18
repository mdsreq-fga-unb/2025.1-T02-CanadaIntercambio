import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/dummy', (req, res) => {
  res.json({ message: 'Texto de exemplo vindo da API TypeScript!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
