const Expense = require('../models/Expense');
const dayjs = require('dayjs');

const getDashboardSummary = async (req, res) => {
  try {
    const start = dayjs().startOf('month').toDate();
    const end = dayjs().endOf('month').toDate();

    const expenses = await Expense.find({
      user: req.userId,
      date: { $gte: start, $lte: end },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categorySpend = {};
    const paymentMethods = {};

    expenses.forEach(({ category, paymentMethod, amount }) => {
      categorySpend[category] = (categorySpend[category] || 0) + amount;
      paymentMethods[paymentMethod] = (paymentMethods[paymentMethod] || 0) + 1;
    });

    const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const topPayments = Object.entries(paymentMethods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([method]) => method);

    const categoryChart = Object.entries(categorySpend).map(([category, value]) => ({
      name: category,
      value,
    }));

    const dailyTotals = {};
    expenses.forEach(({ date, amount }) => {
      const d = dayjs(date).format('YYYY-MM-DD');
      dailyTotals[d] = (dailyTotals[d] || 0) + amount;
    });

    const lineChart = Object.entries(dailyTotals).map(([date, value]) => ({ date, value }));

    res.json({
      totalSpent,
      topCategory,
      topPayments,
      categoryChart,
      lineChart,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard data' });
  }
};

module.exports = { getDashboardSummary };
