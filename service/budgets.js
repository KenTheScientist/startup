const crypto = require('crypto');
const express = require('express');

const { budgetCollection } = require('./database');

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

  async function user(req, res) {
    const found = await userFromRequest(req);
    if (!found) res.status(401).send({ msg: 'Unauthorized' });
    return found;
  }

  // A budget the signed-in user belongs to, or a 404.
  async function memberBudget(req, res) {
    const current = await user(req, res);
    if (!current) return null;
    const budget = await budgetCollection.findOne({ code: req.params.code, members: current.username });
    if (!budget) res.status(404).send({ msg: 'Budget not found' });
    return budget;
  }

  router.get('/budgets', async (req, res) => {
    const current = await user(req, res);
    if (current) res.send(await budgetCollection.find({ members: current.username }).toArray());
  });

  router.post('/budgets', async (req, res) => {
    const current = await user(req, res);
    if (!current) return;
    let code = joinCode();
    while (await budgetCollection.findOne({ code })) code = joinCode();
    const budget = {
      name: req.body.name,
      code,
      owner: current.username,
      members: [current.username],
      funds: 0,
      envelopes: [],
      activity: [],
    };
    await budgetCollection.insertOne(budget);
    res.status(201).send(budget);
  });

  router.get('/budgets/:code', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (budget) res.send(budget);
  });

  router.get('/budgets/:code/members', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (budget) res.send(memberList(budget));
  });

  // Join the budget named by the code. The signed-in user is the new member.
  router.post('/budgets/:code/members', async (req, res) => {
    const current = await user(req, res);
    if (!current) return;
    const budget = await budgetCollection.findOne({ code: req.params.code });
    if (!budget) {
      res.status(404).send({ msg: 'No budget with that join code' });
      return;
    }
    if (budget.members.includes(current.username)) {
      res.status(409).send({ msg: 'You already belong to this budget' });
      return;
    }
    budget.members.push(current.username);
    await budgetCollection.updateOne({ code: req.params.code }, { $set: { members: budget.members } });
    res.status(201).send(memberList(budget));
  });

  router.get('/budgets/:code/activity', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (budget) res.send(budget.activity);
  });

  router.get('/budgets/:code/envelopes', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (budget) res.send(budget.envelopes);
  });

  // Replace the envelope list, recompute the total, and record the change.
  router.put('/budgets/:code/envelopes', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (!budget) return;
    const envelopes = req.body.envelopes || [];
    budget.envelopes = envelopes;
    budget.funds = Math.round(envelopes.reduce((sum, envelope) => sum + Number(envelope.balance), 0) * 100) / 100;
    const activity = req.body.activity;
    if (activity) {
      budget.activity.unshift({
        type: activity.type,
        user: (await userFromRequest(req)).username,
        details: activity.details,
        amount: activity.amount,
        envelope: activity.envelope,
      });
    }
    await budgetCollection.updateOne(
      { code: req.params.code },
      { $set: { envelopes: budget.envelopes, funds: budget.funds, activity: budget.activity } }
    );
    res.send(budget.envelopes);
  });

  router.post('/budgets/:code/activity', async (req, res) => {
    const budget = await memberBudget(req, res);
    if (!budget) return;
    const entry = {
      type: req.body.type,
      user: (await userFromRequest(req)).username,
      details: req.body.details,
      amount: req.body.amount,
      envelope: req.body.envelope,
    };
    budget.activity.unshift(entry);
    await budgetCollection.updateOne({ code: req.params.code }, { $set: { activity: budget.activity } });
    res.status(201).send(entry);
  });

  return router;
};
