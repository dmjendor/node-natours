const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const Tour = require('./schemas/tourSchema');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successful'));

const testTour = new Tour({
  name: 'Testing Tour 2',
  duration: 5,
  maxGroupSize: 25,
  difficulty: 'easy',
  price: 501,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR: ', err);
  });

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
