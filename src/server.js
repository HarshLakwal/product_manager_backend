import express from 'express'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// import errorHandler from "./middleware/errorHandler.js";
import dbConnect from "./model/index.js";
import adminRoutes from "./routes/admin/index.js"
import publicRoutes from "./routes/index.js"
import errorHandler from './middleware/errorHandler.js';



dotenv.config(); 

dbConnect.DBConnection(); // connecting the Database

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const corsOptions = {
//   origin: '*',
//   credentials: true,      //access-control-allow-credentials:true
//   optionSuccessStatus: 200
// }

app.use(cors());
app.use(morgan("dev"));

app.use("/api/admin",adminRoutes);
app.use("/api",publicRoutes)

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}🚀 `);
});
