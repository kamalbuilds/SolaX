import { underdogClient } from "../../../lib/underdog";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "POST") {
    console.log(req.body);

    const receiverAddress = req.body.data.payment.customer.solanaPubKey;

    if (receiverAddress) {
      // const receiverAddress = req.body.data.payment.customer.solanaPubKey;

        
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_SHYFT_API_KEY
    };

    const data = {
      network: 'devnet',
      nft_address: 'G4EpMRJirDGFcyq7eR9VZ31nPgDhKLpD3HjpZ8GXTzVm',
      sender: 'BFefyp7jNF5Xq2A4JDLLFFGpxLq5oPEFKBAQ46KJHW2R',
      receiver: receiverAddress
    };

    const url = 'https://api.shyft.to/sol/v1/nft/compressed/transfer';

    axios.post(url, data, { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log('error', error);
      });

        return res.status(200).json({ message: "OK" });
    }
  }

  res.status(400).json({ message: "Not OK" });
};

export default handler;
