const { Router } = require('express');
const { runSimulacion, getHistorial } = require('../controllers/simulacion');

const router = Router();

router.post('/run', runSimulacion);
router.get('/historial', getHistorial);

module.exports = router;
