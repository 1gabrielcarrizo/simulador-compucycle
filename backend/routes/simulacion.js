const { Router } = require('express');
const { runSimulacion } = require('../controllers/simulacion');

const router = Router();

router.post('/run', runSimulacion);

module.exports = router;
