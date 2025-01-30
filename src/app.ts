import express from "express";
import statsRoutes from "./routes/statsRoutes";
import priceRoutes from "./routes/priceRoutes";
import consumptionRoutes from "./routes/consumptionRoutes";
import "./utils/prototypeUtils";

const app = express();

app.use(express.json());

app.use("/api/stats", statsRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/consumption-vs-production", consumptionRoutes);

export default app;
