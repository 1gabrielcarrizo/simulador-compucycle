const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();
const PORT = process.env.PORT || 4000;

dbConnection();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, servicio: 'CompuCycle Simulador API' });
});

app.use('/api/simulacion', require('./routes/simulacion'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
