// src/app.ts
import express, { Application } from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/BlogRoutes';
import tagRoutes from "./routes/TagRouter"
import imageRouter from "./routes/ImageRoute"
import authRouter from "./routes/AuthRoutes"
import { jwtStrategy } from "./config/token";
import metaDataRouter from "./routes/MetaDataRoutes"
import swagger from "swagger-ui-express";
import apiDocs from "./config/swagger";
import passport from "passport"


import cors from 'cors';
import userRouter from './routes/UserRoutes';
import waitListRouter from './routes/WaitListRoutes';
import { envConfigs } from './config/envconfig';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors())
passport.use('jwt', jwtStrategy);

app.use(
  "/api-doc",
  swagger.serve,
  swagger.setup(apiDocs, {
    swaggerOptions: {
      plugins: [],
    },
  })
);

app.get("/", async (req:any, res:any) => {
  return res.send("Server is running");
});

// Define routes
app.use('/api/blogs', blogRoutes);
app.use('/api/tags', tagRoutes)
app.use('/api/image', imageRouter)
app.use('/api/users', userRouter)
app.use("/api/auth", authRouter)
app.use("/api/waitList",waitListRouter)
app.use("/api/meta", metaDataRouter)


// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  return res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

export default app;
