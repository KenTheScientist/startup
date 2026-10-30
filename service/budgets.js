const crypto = require('crypto');
const express = require('express');

const budgets = [];

function joinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 5 }, () => chars[crypto.randomInt(chars.length)]).join('');
}

function memberList(budget) {
  return budget.members.map((name) => ({ name, role: name === budget.owner ? 'Owner' : 'Member' }));
}

// Routes for budgets, their members, and their activity. Every route requires the auth cookie.
module.exports = function budgetRoutes(userFromRequest) {
  const router = express.Router();

  function user(req, res) {
    const found = userFromRequest(req);
    if (!found) res.status(401).send({ msg: 'Unauthorized' });
    return found;
  }

  // A budget the signed-in user belongs to, or a 404.
  function memberBudget(req, res) {
    const current = user(req, res);
    if (!current) return null;
    const budget = budgets.find((item) => item.code === req.params.code && item.members.includes(current.username));
    if (!budget) res.status(404).send({ msg: 'Budget not found' });
    return budget;
  }

  router.get('/budgets', (req, res) => {
    const current = user(req, res);
    if (current) res.send(budgets.filter((item) => item.members.includes(current.username)));
  });

  router.post('/budgets', (req, res) => {
    const current = user(req, res);
    if (!current) return;
    let code = joinCode();
    while (budgets.some((item) => item.code === code)) code = joinCode();
    const budget = {
      name: req.body.name,
      code,
      owner: current.username,
      members: [current.username],
      funds: 0,
      envelopes: [],
      activity: [],
    };
    budgets.push(budget);
    res.status(201).send(budget);
  });

  router.get('/budgets/:code', (req, res) => {
    const budget = memberBudget(req, res);
    if (budget) res.send(budget);
  });

  router.get('/budgets/:code/members', (req, res) => {
    const budget = memberBudget(req, res);
    if (budget) res.send(memberList(budget));
  });

  // Join the budget named by the code. The signed-in user is the new member.
  router.post('/budgets/:code/members', (req, res) => {
    const current = user(req, res);
    if (!current) return;
    const budget = budgets.find((item) => item.code === req.params.code);
    if (!budget) {
      res.status(404).send({ msg: 'No budget with that join code' });
      return;
    }
    if (budget.members.includes(current.username)) {
      res.status(409).send({ msg: 'You already belong to this budget' });
      return;
    }
    budget.members.push(current.username);
    res.status(201).send(memberList(budget));
  });

  router.get('/budgets/:code/activity', (req, res) => {
    const budget = memberBudget(req, res);
    if (budget) res.send(budget.activity);
  });

  router.post('/budgets/:code/activity', (req, res) => {
    const budget = memberBudget(req, res);
    if (!budget) return;
    const entry = {
      type: req.body.type,
      user: userFromRequest(req).username,
      details: req.body.details,
      amount: req.body.amount,
      envelope: req.body.envelope,
    };
    budget.activity.unshift(entry);
    res.status(201).send(entry);
  });

  return router;
};
