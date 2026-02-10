const fs = require('fs');

const TOURS = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(TOURS));

/**
 * Validate `:id` route params before hitting id-based handlers.
 * Returns 404 when the id is outside the current in-memory tour range.
 */
exports.checkID = (req, res, next, val) => {
  const id = Number(req.params.id);
  console.log(`TourId: ${val}`);
  if (id > tours.length)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  next();
};

/**
 * GET /api/v1/tours
 * Return all tours with metadata (request timestamp and count).
 */
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

/**
 * GET /api/v1/tours/:id
 * Return a single tour matching the numeric id param.
 */
exports.getTourById = (req, res) => {
  const id = Number(req.params.id);

  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

/**
 * POST /api/v1/tours
 * Create a new tour from request body and persist to the JSON data file.
 */
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

/**
 * PATCH /api/v1/tours/:id
 * Placeholder handler for partial updates.
 */
exports.updateTourById = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: '<Updated Tour here...>',
  });
};

/**
 * DELETE /api/v1/tours/:id
 * Placeholder handler for deleting a tour by id.
 */
exports.deleteTourById = (req, res) => {
  const id = Number(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

exports;
