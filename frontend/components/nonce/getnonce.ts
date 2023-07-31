import {
    clusterApiUrl,
    Connection,
    PublicKey,
    NonceAccount,
  } from "@solana/web3.js";
  
  export async function getNonce(publicKey) {
    // connection
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const nonceAccountPubkey = new PublicKey(publicKey);
  
    let accountInfo = await connection.getAccountInfo(nonceAccountPubkey);
    if (!accountInfo) {
      console.log("Account not found");
      return;
    }
  
    let nonceAccount = NonceAccount.fromAccountData(accountInfo.data);
    console.log(`nonce: ${nonceAccount.nonce}`);
    console.log(`authority: ${nonceAccount.authorizedPubkey.toBase58()}`);
    console.log(`fee calculator: ${JSON.stringify(nonceAccount.feeCalculator)}`);
  
    // return values
    return {
      nonce: nonceAccount.nonce,
      authority: nonceAccount.authorizedPubkey.toBase58(),
      feeCalculator: nonceAccount.feeCalculator,
    };
  }
  