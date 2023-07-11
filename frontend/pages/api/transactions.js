import * as gariSdk from "gari";

const gariClientId = "d8817deb-dceb-40a4-a890-21f0286c8fba";
const secretKey = "964f2bdd-18b6-4e45-be21-636ce81efd6f";

export default async function handler(req, res) {
  const partialSignedEncodedTransaction =
    req.body.partialSignedEncodedTransaction;
  const token = req.headers.token;

  // estract sender & receiver details from partial signaed decoded tranmsactio  

  // pass configdetails to initialize sdk 
  let configDetails = {
    gariClientId,
    secretKey,
    web3authClientId: "",
    verifierName: "",
    verifierDomain: "",
    environment : "devnet"
  };
  gariSdk.sdkInitialize(configDetails);
   
  // after validation 
  const transactionResponse = await gariSdk.initiateTransaction(
    partialSignedEncodedTransaction,
    token,
    // gariClientId
  );

  res.json(transactionResponse);
}
