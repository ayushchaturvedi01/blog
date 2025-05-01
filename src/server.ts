// src/server.ts
import app from './app';
const PORT = process.env.PORT || 8080;
// Connect to MongoDB
import mongoose from 'mongoose';
import { envConfigs } from './config/envconfig';
mongoose
  .connect(envConfigs.dburl)
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
