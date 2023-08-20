
import { NextUnderdog, NetworkEnum } from "@underdog-protocol/js";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const { network } = req.query;

  const nextUnderdog = NextUnderdog({
    apiKey: process.env.NEXT_PUBLIC_UNDERSCORE_API_KEY!,
    network: (network as string).toUpperCase() as NetworkEnum,
  });

  await nextUnderdog(req, res);
};

export default handler;