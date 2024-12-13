const express = require('express');
const { runPythonScript } = require('../controller/python.controller');
const router = express.Router();

router.get('/run-python', runPythonScript);

module.exports = router;
