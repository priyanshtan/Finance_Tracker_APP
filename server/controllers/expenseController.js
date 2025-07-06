const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  try {
    const newExpense = await Expense.create({ ...req.body, user: req.userId });
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const query = { user: req.userId };
    if (req.query.category) query.category = req.query.category;
    if (req.query.paymentMethod) query.paymentMethod = req.query.paymentMethod;
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!result) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};