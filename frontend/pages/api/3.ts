import type { NextApiRequest, NextApiResponse } from "next";
import { Connection } from "@solana/web3.js";
import { walletNameToAddressAndProfilePicture } from "@portal-payments/solana-wallet-names";

type WalletAddress = {
  walletAddress: string;
};

type ResponseData = {
  data?: WalletAddress;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { walletName } = req.body;

  if (typeof walletName !== "string") {
    res.status(400).json({ error: "walletName must be a string" });
    return;
  }

  const connection = new Connection(
    "https://api.mainnet-beta.solana.com/"
  );

  try {
    const walletNameAndProfilePicture =
      await walletNameToAddressAndProfilePicture(connection, walletName);

    if (walletNameAndProfilePicture.walletAddress === null) {
      res.status(404).json({ error: "Wallet address not found" });
      return;
    }

    const walletAddress: WalletAddress = {
      walletAddress: walletNameAndProfilePicture.walletAddress,
    };

    res.status(200).json({ data: walletAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wallet info" });
  }
}
