const crypto = require('crypto');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const users = [];

app.use(express.json());
app.use(cookieParser());

const api = express.Router();
app.use('/api', api);
api.use(require('./budgets')(userFromRequest));

function setAuthCookie(res, token) {
  res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
}

function userFromRequest(req) {
  const token = req.cookies.token;
  return token && users.find((user) => user.token === token);
}

api.post('/auth/register', async (req, res) => {
  if (users.some((user) => user.username === req.body.username)) {
    res.status(409).send({ msg: 'Username already exists' });
    return;
  }
  const user = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 10),
    token: crypto.randomUUID(),
  };
  users.push(user);
  setAuthCookie(res, user.token);
  res.send({ username: user.username });
});

api.post('/auth/login', async (req, res) => {
  const user = users.find((item) => item.username === req.body.username);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).send({ msg: 'Invalid username or password' });
    return;
  }
  user.token = crypto.randomUUID();
  setAuthCookie(res, user.token);
  res.send({ username: user.username });
});

api.delete('/auth/logout', (req, res) => {
  const user = userFromRequest(req);
  if (user) user.token = '';
  res.clearCookie('token');
  res.status(204).end();
});

// Requires the auth cookie. Returns the signed-in user.
api.get('/me', (req, res) => {
  const user = userFromRequest(req);
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
