const dotenv = require('dotenv');
dotenv.config({ path: '.env.dev' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(2);
}

(async () => {
  try {
    await mongoose.connect(uri, {});
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    if (!collections.length) {
      // no output requested
    } else {
      for (const c of collections) {
        const name = c.name;
        let count = 0;
        try {
          count = await db.collection(name).countDocuments();
        } catch (e) {
          count = 'error';
        }
        // no output requested
      }
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
