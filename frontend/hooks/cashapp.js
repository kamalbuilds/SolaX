import { useEffect, useState } from "react";
// Function that gets random avatar based on wallet address
import { getAvatarUrl } from "../functions/getAvatarUrl";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = window?.localStorage?.getItem(key) || "[]";
      // Parse stored json or if none return initialValue
      setValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }, []);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);

      if (window && window?.localStorage) {
        // Save to local storage
        window?.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export const useCashApp = () => {
  // LocalStorage Hook

  // this is very bad paratice hook

  // I can create a transaction request with Solana pay between two wallets
  // I want to be able to decide which two wallets to send/receive sol
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction } = useWallet();

  const [avatar, setAvatar] = useState("");
  const [userAddress, setUserAddress] = useState("Not connected");
  const [amount, setAmount] = useState(0);
  // State for localStorage Array
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false);

  useEffect(() => {
    if (connected) {
      setAvatar(getAvatarUrl(publicKey.toString()));
      setUserAddress(publicKey.toString());
    }
  }, [connected]);

  // Args:
  // - fromWallet: PublicKey
  // - toWallet: PublicKey
  // - amount: BigNumber
  // - reference: PublicKey
  async function makeTransaction(fromWallet, toWallet, amount, reference) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    // Get a recent blockhash to include in the transaction
    const { blockhash } = await connection.getLatestBlockhash("finalized");

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      // The buyer pays the transaction fee
      feePayer: fromWallet,
    });

    console.log(amount); // bigNumber

    console.log(amount.multipliedBy(LAMPORTS_PER_SOL));

    // Create the instruction to send SOL from the buyer to the shop
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromWallet,
      lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
      toPubkey: toWallet,
    });

    // Add the reference to the instruction as a key
    // This will mean this transaction is returned when we query for the reference
    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });

    // Add the instruction to the transaction
    transaction.add(transferInstruction);

    return transaction;
  }

  async function doTransaction({ amount, receiver, transactionPurpose }) {
    console.log("amount", amount);
    const fromWallet = publicKey;
    const toWallet = new PublicKey(receiver);
    const bnAmount = new BigNumber(amount);
    const reference = Keypair.generate().publicKey;
    const transaction = await makeTransaction(
      publicKey,
      toWallet,
      bnAmount,
      reference
    );

    const txnHash = await sendTransaction(transaction, connection);
    alert("Congratulations 🚀🪙, your transaction is successfull");
    console.log(txnHash);

    const newID = (transactions.length + 1).toString();
    const newTransaction = {
      id: newID,
      from: {
        name: publicKey.toString(),
        handle: publicKey.toString(),
        avatar: avatar,
        verified: true,
      },
      to: {
        name: receiver,
        handle: "",
        avatar: getAvatarUrl(receiver.toString()),
        verified: false,
      },
      description: transactionPurpose,
      amount: bnAmount.toString(),
      status: "Completed",
      transactionHash: txnHash,
      timestamp: new Date().toISOString(),
    };
    console.log(transactions);
    setTransactions([...transactions, newTransaction]);
    return newTransaction;
  }

  return {
    getAvatarUrl,
    avatar,
    userAddress,
    amount,
    setAmount,
    makeTransaction,
    doTransaction,
    transactions,
    setTransactions,
    newTransactionModalOpen,
    setNewTransactionModalOpen,
  };
};
