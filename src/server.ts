import express from "express";
import statisticsRoute from "./routes/statisticsRoute";
import "./utils/prototypeUtils";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    methods: ["GET"],
  })
);
app.use("/api/statistics", statisticsRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
