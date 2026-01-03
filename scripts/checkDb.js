const dotenv = require('dotenv');
dotenv.config({ path: '.env.dev' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(2);
}

mongoose
  .connect(uri, {})
  .then(async () => {
    const db = mongoose.connection.db;
    await db.listCollections().toArray();
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection error:', err && err.message ? err.message : err);
    process.exit(1);
  });
