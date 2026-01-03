const dotenv = require('dotenv');
dotenv.config({ path: '.env.dev' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set for dev seeding');
  process.exit(2);
}

const seed = async () => {
  try {
    await mongoose.connect(uri, {});
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (!names.includes('recipes')) {
      await db.createCollection('recipes');
    }
    if (!names.includes('users')) {
      await db.createCollection('users');
    }
    if (!names.includes('comments')) {
      await db.createCollection('comments');
    }

    const usersCount = await db.collection('users').countDocuments();
    const recipesCount = await db.collection('recipes').countDocuments();
    const commentsCount = await db.collection('comments').countDocuments();

    if (usersCount === 0) {
      await db.collection('users').insertOne({ email: 'dev@test.com', password: 'devpass' });
    }
    if (recipesCount === 0) {
      const res = await db.collection('recipes').insertOne({
        title: 'Seeded Recipe',
        ingredients: ['Ingredient A', 'Ingredient B'],
        steps: ['Step 1', 'Step 2'],
        cookingTime: 20,
        imageCover: 'cover-seed.jpg',
        difficulty: 'easy',
        ratingsAverage: 4.5,
        ratingsQuantity: 0
      });
      if (commentsCount === 0) {
        await db.collection('comments').insertMany([
          { comment: 'Nice recipe', recipe: res.insertedId },
          { comment: 'Needs more salt', recipe: res.insertedId }
        ]);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error', err && err.message ? err.message : err);
  }
};

seed();
