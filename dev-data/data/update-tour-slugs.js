const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');

const Tour = require('../../models/tourModel');

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

const updateTourSlugs = async () => {
  try {
    const tours = await Tour.aggregate([
      {
        $project: {
          name: 1,
        },
      },
    ]);

    const operations = tours.map((tour) => ({
      updateOne: {
        filter: { _id: tour._id },
        update: {
          $set: { slug: slugify(tour.name, { lower: true }) },
        },
      },
    }));

    if (operations.length === 0) {
      console.log('No tours found.');
      process.exit();
    }

    await Tour.bulkWrite(operations);
    console.log(`Updated slugs for ${operations.length} tours.`);
  } catch (err) {
    console.error(err);
  }

  process.exit();
};

updateTourSlugs();
