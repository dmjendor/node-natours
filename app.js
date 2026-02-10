const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
const TOURS = `${__dirname}/dev-data/data/tours-simple.json`;
const USERS = `${__dirname}/dev-data/data/users.json`;
const PORT = 8000;

app.use(morgan('dev'));
app.use(express.json());

// 1) MIDDLEWARES
// this applies to ALL requests, since there is no route.
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next(); // always use next in middleware
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // always use next in middleware
});

const tours = JSON.parse(fs.readFileSync(TOURS));
const users = JSON.parse(fs.readFileSync(USERS));

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(TOURS, JSON.stringify(tours), (err) => {
    if (err) console.log('Error:', err);
  });
  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
};

const updateTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated Tour here...>',
  });
};

const deleteTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: { users },
  });
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  const user = users.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { user },
  });
};

const createUser = (req, res) => {
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

const updateUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated User here...>',
  });
};

const deleteUserById = (req, res) => {
  const id = Number(req.params.id);
  if (id > users.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

// 3) ROUTES
// app.get('/api/v1/tours', getAllUsers);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

// 4) START SERVER

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
