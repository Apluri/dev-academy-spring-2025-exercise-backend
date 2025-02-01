import express from "express";
import statisticsRoute from "./routes/statisticsRoute";
import "./utils/prototypeUtils";
import { internalServerErrorHandler } from "./middlewares/errorHandler";
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/statistics", statisticsRoute);

app.use(internalServerErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
