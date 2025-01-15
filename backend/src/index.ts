import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv'

interface FundingRoundResponse {
  name?: string;
  amount: number;
  date: string;
}

dotenv.config({ path: '.env.dev' })
const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/funding-rounds", async (req: Request, res: Response) => {
  const fundingRounds = await prisma.fundingRound.findMany({
    take: 20,
  });
  res.json(
    fundingRounds.map(({ name, amount }) => ({ name, amount: Number(amount) })),
  );
});

app.get("/funding-rounds/top15", async (_req: Request, res: Response<FundingRoundResponse[]>) => {
  const topFundingRounds = await prisma.fundingRound.findMany({
    take: 15,
    orderBy: {
      amount: 'desc'
    }
  });

  res.json(
    topFundingRounds.map(({ name, amount, date }) => ({
      name,
      amount: Number(amount),
      date: date.toISOString().split("T")[0],
    }))
  );
});

app.get("/funding-rounds/timeline", async (_req: Request, res: Response<FundingRoundResponse[]>) => {
  const fundingRoundsTimeline = await prisma.fundingRound.findMany({
    orderBy: { date: 'asc' },
    select: {
      date: true,
      amount: true,
    },
  });

  res.json(
    fundingRoundsTimeline.map(({ date, amount }) => ({
      date: date.toISOString().split("T")[0],
      amount: Number(amount),
    }))
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
