import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const test = await prisma.electricitydata.findMany();
  const result = test.map((entry) => ({
    ...entry,
    id: entry.id.toString(),
  }));
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
