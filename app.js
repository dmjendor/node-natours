const fs = require('fs');
const express = require('express');

const app = express();
const TOURS = `${__dirname}/dev-data/data/tours-simple.json`;
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(TOURS));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
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
    console.log('Error:', err);
  });
  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
};

const updateTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated Tour here...>',
  });
};

const deleteTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);

app.route('api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTourById).patch(updateTourById).delete(deleteTourById);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
