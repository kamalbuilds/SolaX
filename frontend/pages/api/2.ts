import type { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "@solana/web3.js";
import { Elusiv } from "@elusiv/sdk";

type Token = "SAMO" | "USDC" | "USDT" | "LAMPORTS" | "BONK" | "mSOL";
type ResponseData = {
  data: Array<{ token: Token, poolSize: number, poolValueInDollars: number }>;
};

// Normalizes a token amount to its proper decimal places
function normalizeAmount(amount: number, decimals: number) {
  return amount / Math.pow(10, decimals);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const connection = new Connection(
    "https://api.mainnet-beta.solana.com/"
  );

  const tokens: Token[] = ["SAMO", "USDC", "USDT", "LAMPORTS", "BONK", "mSOL"];
  
  const tokenDecimals: { [key in Token]: number } = {
    SAMO: 9,
    LAMPORTS: 9,
    USDC: 6,
    BONK: 5,
    USDT: 6,
    mSOL: 9,
  };

  const tokenPrices: { [key in Token]: number } = {
    SAMO: 0.003391,
    LAMPORTS: 15.57,
    USDC: 1,
    BONK: 0.0000003,
    USDT: 0.999587,
    mSOL: 17.388,
  };

  // initialize an empty array to hold the results
  const poolData = [];

  // iterate over the tokens array and fetch the pool size for each token
  for (const token of tokens) {
    const rawPoolSize = await Elusiv.getCurrentPoolSize(
      "mainnet-beta",
      connection,
      token
    );

    // Normalize the pool size
    const poolSize = normalizeAmount(rawPoolSize, tokenDecimals[token]);

    // Calculate pool value in dollars
    const poolValueInDollars = poolSize * tokenPrices[token];

    // push the token, pool size and its value in dollars to the results array
    poolData.push({ token, poolSize, poolValueInDollars });
  }

  // send the results
  res.json({ data: poolData });
}
