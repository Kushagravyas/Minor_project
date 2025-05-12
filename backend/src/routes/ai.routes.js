const express = require('express');
const aiController = require('../controller/ai.controller');

const router = express.Router();

router.get("/get-response", aicontroller.getResponse )

module.exports = router;