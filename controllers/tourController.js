const fs = require('fs');

const TOURS = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(TOURS));
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(204).json({
    status: 'success',
    data: '<Updated Tour here...>',
  });
};

exports.deleteTourById = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

exports;
