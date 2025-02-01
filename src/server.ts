import express from "express";
import statsRoutes from "./routes/statsRoutes";
import priceRoutes from "./routes/priceRoutes";
import consumptionRoutes from "./routes/consumptionRoutes";
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

app.use("/api/stats", statsRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/consumption-vs-production", consumptionRoutes);

app.use(internalServerErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
