import { underdogClient } from "../../../lib/underdog";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.SPHERE_WEBHOOK_SECRET) {
    const signature = crypto
      .createHmac("sha256", Buffer.from(process.env.SPHERE_WEBHOOK_SECRET!))
      .update(JSON.stringify(req.body), "utf8")
      .digest("hex");

    if (signature !== req.headers["signature"]) {
      return res.status(403).json({ message: "Not OK" });
    }
  }

  if (req.method === "POST") {
    const projectId =
      req.body.data.payment.paymentLink.lineItems[0].price.product.meta
        .projectId;

    if (projectId) {
      const receiverAddress = req.body.data.payment.customer.solanaPubKey;

      await underdogClient.createSft({
        params: { projectId },
        body: { receiverAddress },
      });

      return res.status(200).json({ message: "OK" });
    }
  }

  res.status(400).json({ message: "Not OK" });
};

export default handler;
