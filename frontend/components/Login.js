import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import ReactLoading from "react-loading";
import BigNumber from "bignumber.js";
import { Button } from "./Button";
import { Input } from "./input";
import * as gariSdk from "gari";
export default function SignIn() {
  const [{ token }, dispatch] = useAuthContext(); // token refers to users jwtToken
  const [wallet, setWallet] = useState(null);
  const [userId, setUserid] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [amount, setAmount] = useState(null);
  const [sig, setSig] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // client should receive its gariClientId
  const gariClientId = "d8817deb-dceb-40a4-a890-21f0286c8fba";

  // jwtToken creation part is handled in gari Client backend
  async function getToken(userId) {
    const loginResponse = await axios.get(
      // `http://localhost:3000/api/login?userId=${userId}`
      `https://demo-gari-sdk.vercel.app/api/login?userId=${userId}`
    );
    console.log("jwtToken", loginResponse.data);
    return loginResponse.data;
  }

  // airdrop should be decided by gari Client that when to credit it to its user
  async function handleAirdrop() {
    try {
      setLoading(true);
      console.log(`getAirdrop called`);
      const publicKey = wallet.publicKey;

      // gariSdk.sdkInitialize(gariClientId);
      const airdropSignature = await axios.post(
        // `http://localhost:3000/api/airdrop`,
        `https://demo-gari-sdk.vercel.app/api/airdrop`,
        { publicKey },
        {
          headers: {
            token,
          },
        }
      );
      console.log(
        "airdropSignature finally ------------>  ",
        airdropSignature.data
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error in airdrop function demoApp ui", error);
      return error;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const token = await getToken(userId);
    dispatch({ type: "login", token });
    // const goingToReplaceToken = await axios.get(
    //   `http://localhost:3000/api/replaceJwtToken?token=${token}`
    // );
    // console.log("newToken ", goingToReplaceToken.data);
  }

  async function handleTransaction(event) {
    try {
      event.preventDefault();
      setLoading(true);

      // partial sign from sender wallet
      let lamportAmount = new BigNumber(amount)
        .multipliedBy(1000000000)
        .toFixed(); // provide lamport amount

      if (amount <= 0) throw new Error("amount should be greater than 0 ");
      const partialSignedTransaction = await gariSdk.transferGariToken(
        token,
        publicKey,
        lamportAmount
      );

      const partialSignedEncodedTransaction =
        partialSignedTransaction.encodedTransaction;
      console.log(
        "partialSignedEncodedTransaction ------> ",
        partialSignedEncodedTransaction
      );
      const transactionSignature = await axios.post(
        // `http://localhost:3000/api/transaction`,
        `https://demo-gari-sdk.vercel.app/api/transaction`,
        { partialSignedEncodedTransaction },
        {
          headers: {
            token,
          },
        }
      );

      console.log("transactionSignature", transactionSignature);
      setSig(transactionSignature.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  }

  async function getWalletDetails() {
    try {
      setLoading(true);
      const walletRes = await gariSdk.createWalletOrGetWallet(token);
      walletRes.balance = new BigNumber(walletRes.balance)
        .div(1000000000)
        .toFixed();
      setWallet(walletRes);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error in demo app frontend ", error);
    }
  }

  useEffect(() => {
    console.log(`gariSdk version ${gariSdk.packageVersion()}`);
    //let environment = 'devnet'; // to use mainnet pass "mainnet"
    let configDetails = {
      gariClientId,
      secretKey: undefined,
      web3authClientId: "",
      verifierName: "",
      verifierDomain: "",
      environment: "devnet",
    };
    gariSdk.sdkInitialize(configDetails);
  }, []);

  return token ? (
    <div className="flex min-h-[90vh] items-center justify-center">
      <form onSubmit={handleTransaction}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            zIndex: 1,
          }}
        >
          {isLoading && (
            <ReactLoading type={"spin"} color={"black"} height={667} />
          )}
        </div>
        <h4 style={{ color: "black" }}>
          PublicKey:{" "}
          <span style={{ color: "green" }}>
            {wallet == null ? "" : wallet.publicKey}
          </span>
        </h4>
        <h4 style={{ color: "black" }}>
          balance:{" "}
          <span style={{ color: "green" }}>
            {wallet == null ? "" : wallet.balance}
          </span>
        </h4>
        <Button type="button" onClick={getWalletDetails}>
          Get Wallet Details
        </Button>
        <Button type="button" onClick={handleAirdrop}>
          Get airdrop
        </Button>
        <div>
          <label>To Public Key</label>
          <Input
            variant="outlined"
            name="publicKey"
            margin="dense"
            required
            fullWidth
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>
        <label>Amount</label>
        <Input
          variant="outlined"
          name="amount"
          margin="dense"
          required
          fullWidth
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit" sx={{ mt: 2 }}>
          Make Transaction
        </Button>
        <h6 style={{ color: "black" }}>
          Signature:{" "}
          <span style={{ color: "red" }}>{sig == null ? "" : sig}</span>
        </h6>
        <Button
          onClick={() =>
            dispatch({ type: "logout", message: "Logged Out Successfully" })
          }
        >
          Log Out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex min-h-[90vh] items-center justify-center">
      <form onSubmit={handleLogin}>
        <div>
          <label>UserId</label>
          <Input
            variant="outlined"
            name="userId"
            className="mx-2"
            required
            fullWidth
            type="number"
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
