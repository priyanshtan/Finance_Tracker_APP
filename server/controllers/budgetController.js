const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const dayjs = require('dayjs');

const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const existing = await Budget.findOne({ user: req.userId, category });

    if (existing) {
      existing.limit = limit;
      await existing.save();
      return res.json(existing);
    }

    const newBudget = await Budget.create({ user: req.userId, category, limit });
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ message: 'Failed to set budget' });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets' });
  }
};

const getBudgetAlerts = async (req, res) => {
  try {
    const currentMonth = dayjs().startOf('month');
    const expenses = await Expense.find({
      user: req.userId,
      date: { $gte: currentMonth.toDate() },
    });

    const budgets = await Budget.find({ user: req.userId });
    const alerts = [];

    budgets.forEach(budget => {
      const total = expenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);

      const percent = (total / budget.limit) * 100;

      if (percent >= 80) {
        alerts.push({
          category: budget.category,
          spent: total,
          limit: budget.limit,
          alert: percent >= 100 ? 'Limit Exceeded' : 'Approaching Limit',
        });
      }
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error generating alerts' });
  }
};

module.exports = {
  setBudget,
  getBudgets,
  getBudgetAlerts,
};