const fs = require('fs');
const USERS = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(fs.readFileSync(USERS));

/**
 * Validate `:id` route params before hitting id-based handlers.
 * Returns 404 when the id is outside the current in-memory user range.
 */
exports.checkID = (req, res, next, val) => {
  const id = Number(req.params.id);
  console.log(`UserId: ${val}`);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  next();
};

/**
 * GET /api/v1/users
 * Return all users with metadata (request timestamp and count).
 */
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
};

/**
 * GET /api/v1/users/:id
 * Return a single user matching the numeric id param.
 */
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

/**
 * POST /api/v1/users
 * Create a new user from request body and persist to the JSON data file.
 */
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

/**
 * PATCH /api/v1/users/:id
 * Placeholder handler for partial updates.
 */
exports.updateUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated User here...>',
  });
};

/**
 * DELETE /api/v1/users/:id
 * Placeholder handler for deleting a user by id.
 */
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
