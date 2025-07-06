const express = require('express');
const auth = require('../middleware/auth');
const {
  setBudget,
  getBudgets,
  getBudgetAlerts,
} = require('../controllers/budgetController');

const router = express.Router();

router.use(auth);

router.post('/', setBudget);
router.get('/', getBudgets);
router.get('/alerts', getBudgetAlerts);

module.exports = router;