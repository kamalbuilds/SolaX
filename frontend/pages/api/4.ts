import type { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "@solana/web3.js";
import { Elusiv } from "@elusiv/sdk";

type Token = "SAMO" | "USDC" | "USDT" | "LAMPORTS" | "BONK" | "mSOL";
type ResponseData = {
  data: Array<{ token: Token, estimateLastTxs: number }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const connection = new Connection(
    "https://api.mainnet-beta.solana.com/"
  );

  const tokenTypes: Token[] = ["SAMO", "USDC", "USDT", "LAMPORTS", "BONK", "mSOL"];
  
  const data = [];
  
  for (const tokenType of tokenTypes) {
    const estimateLastTxs = await Elusiv.estimateTxsCountLastTime(
      "mainnet-beta",
      connection,
      3600,
      tokenType
    );
    data.push({ token: tokenType, estimateLastTxs });
  }


  // send the results
  res.json({ data });
}
