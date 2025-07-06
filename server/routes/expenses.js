const express = require('express');
const auth = require('../middleware/auth');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

router.use(auth);

router.post('/', addExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
