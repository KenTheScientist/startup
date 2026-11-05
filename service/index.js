const crypto = require('crypto');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const { userCollection, budgetCollection } = require('./database');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

const api = express.Router();
app.use('/api', api);
api.use(require('./budgets')(userFromRequest));

function setAuthCookie(res, token) {
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
}

async function userFromRequest(req) {
  const token = req.cookies.token;
  if (!token) return null;
  return userCollection.findOne({ token });
}

api.post('/auth/register', async (req, res) => {
  const existing = await userCollection.findOne({ username: req.body.username });
  if (existing) {
    res.status(409).send({ msg: 'Username already exists' });
    return;
  }

  const user = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    token: crypto.randomUUID(),
  };
  await userCollection.insertOne(user);
  setAuthCookie(res, user.token);
  res.send({ username: user.username });
});

api.post('/auth/login', async (req, res) => {
  const user = await userCollection.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).send({ msg: 'Invalid username or password' });
    return;
  }
  user.token = crypto.randomUUID();
  await userCollection.updateOne(
    { username: user.username },
    { $set: { token: user.token } }
  );
  setAuthCookie(res, user.token);
  res.send({ username: user.username });
});

api.delete('/reset', async (req, res) => {
  await userCollection.deleteMany({});
  await budgetCollection.deleteMany({});
  res.clearCookie('token');
  res.status(204).end();
});

api.delete('/auth/logout', async (req, res) => {
  const user = await userFromRequest(req);
  if (user) await userCollection.updateOne(
    { username: user.username },
    { $set: { token: '' } }
  );
  res.clearCookie('token');
  res.status(204).end();
});

// Requires the auth cookie. Returns the signed-in user.
api.get('/me', async (req, res) => {
  const user = await userFromRequest(req);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  res.send({ username: user.username });
});

app.use(express.static('public'));

// Client routes such as /envelopes are not files. Send the app so the router can handle them.
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.resolve('public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
