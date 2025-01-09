import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/funding-rounds", (req: Request, res: Response) => {
  const fundingRounds = [
    { round: "Seed", amount: 50000 },
    { round: "Series A", amount: 200000 },
    { round: "Series B", amount: 500000 },
  ];
  res.json(fundingRounds);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
