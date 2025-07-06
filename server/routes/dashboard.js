const express = require('express');
const auth = require('../middleware/auth');
const { getDashboardSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.use(auth);
router.get('/', getDashboardSummary);

module.exports = router;
