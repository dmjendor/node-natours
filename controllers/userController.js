const fs = require('fs');
const USERS = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(fs.readFileSync(USERS));
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
};

exports.getUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  const user = users.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { user },
  });
};

exports.createUser = (req, res) => {
  //   console.log(req.body);
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(USERS, JSON.stringify(users), (err) => {
    if (err) console.log('Error:', err);
  });
  res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
};

exports.updateUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated User here...>',
  });
};

exports.deleteUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

exports;
