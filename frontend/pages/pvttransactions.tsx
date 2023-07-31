// @ts-nocheck
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { Connection, PublicKey } from "@solana/web3.js";
import { Elusiv, PrivateTxWrapper, SEED_MESSAGE } from "@elusiv/sdk";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { MainNav } from "../components/ui/main-nav";
import Link from "next/link";
import { Skeleton } from "../components/ui/skeleton";
import { motion, useAnimation } from "framer-motion";
import React, { PureComponent } from "react";
import { Overview } from "../components/ui/overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import axios from "axios";
import { CheckCircle2, SmilePlus, X, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

type SendTxWrapper = {
  // existing properties...
  memo?: string;
  // more properties...
};

interface DataItem {
  token: string;
  estimateLastTxs: number;
}

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

// Custom Hooks
const useScreenSize = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 639px)" });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const width = isSmallScreen ? "350px" : isLargeScreen ? "450px" : "100%";

  return { isSmallScreen, isLargeScreen, width };
};

const useWalletState = () => {
  const wallet = useWallet();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [elusivInstance, setElusivInstance] = useState<Elusiv | null>(null);

  return {
    wallet,
    isSignedIn,
    setIsSignedIn,
    elusivInstance,
    setElusivInstance,
  };
};

const useTransactionState = () => {
  const [transactions, setTransactions] = useState<PrivateTxWrapper[] | null>(
    null
  );
  const [progress, setProgress] = useState(0);

  return { transactions, setTransactions, progress, setProgress };
};

const useBalanceState = () => {
  const [userTokenBalance, setUserTokenBalance] = useState<string | null>(null);
  const [userPrivateTokenBalance, setUserPrivateTokenBalance] = useState<
    string | null
  >(null);

  return {
    userTokenBalance,
    setUserTokenBalance,
    userPrivateTokenBalance,
    setUserPrivateTokenBalance,
  };
};

export default function Home() {
  const { isSmallScreen, isLargeScreen, width } = useScreenSize();
  const {
    wallet,
    isSignedIn,
    setIsSignedIn,
    elusivInstance,
    setElusivInstance,
  } = useWalletState();

  const {
    userTokenBalance,
    setUserTokenBalance,
    userPrivateTokenBalance,
    setUserPrivateTokenBalance,
  } = useBalanceState();

  const { toast } = useToast();
  const [mostLiquidPool, setMostLiquidPool] = useState<{
    name: string;
    usdSize: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const controls = useAnimation(); // control the animation
  const [poolSizes, setPoolSizes] = useState({});
  const [poolData, setPoolData] = useState<
    { name: string; tokenSize: number; usdSize: number }[]
  >([]);
  const [txData, setTxData] = useState<{ name: string; txsCount: number }[]>(
    []
  );
  const [transactions, setTransactions] = useState<PrivateTxWrapper[] | null>(
    null
  );
  const [lastTopUpInfo, setLastTopUpInfo] = useState<{
    date: string;
    elapsedTime: string;
  } | null>(null);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSendClicked, setIsSendClicked] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendPublicKey, setSendPublicKey] = useState("");
  const [status, setStatus] = useState(null);
  const [validityStatus, setValidityStatus] = useState<null | boolean>(null);
  const [hasUserStoppedTyping, setUserStoppedTyping] = useState(false);
  const [actualPublicKey, setActualPublicKey] = useState("");
  const [memoInput, setMemoInput] = useState("");
  const [data, setData] = useState<DataItem[]>([]);
  const [dataTxns, setDataTxns] = useState<DataItem[]>([]);
  const [sendStarted, setSendStarted] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    "item-1"
  );

  useEffect(() => {
    if (wallet.connected) {
      handleSignIn();
    }
  }, [wallet.connected]);

  const handleSignIn = async () => {
    if (!wallet.connected) return;

    if (!wallet.publicKey || !wallet.signMessage) return;

    const message = new TextEncoder().encode(SEED_MESSAGE);

    try {
      const signedMessage = await wallet.signMessage(message);
      const connection = new Connection(
        "https://api.devnet.solana.com/"
      );
      const seed = signedMessage;
      const instance = await Elusiv.getElusivInstance(
        seed,
        wallet.publicKey!,
        connection,
        "devnet"
      );

      // Convert the instance to 'any' type
      const instanceAny = instance as any;

      setIsSignedIn(true);
      setElusivInstance(instanceAny);
      toast({
        title: "Successfully signed in!",
        description: "User has sucessfully signed in with Elusiv.",
      });
    } catch (error) {
      console.log("Sign Message Error:", error);
      toast({
        title: "Sign Message Error",
        description: "User rejected the request.",
        action: <Button onClick={handleSignIn}>Retry</Button>,
      });
    }
  };

  const refreshBalance = () => {
    setRefreshKey((prevKey) => prevKey + 1); // increment the refreshKey by 1
  };

  useEffect(() => {
    if (loading) {
      controls.start({
        rotate: [0, 360],
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      });
    } else {
      controls.stop(); // stop the animation
    }
  }, [loading, controls]);

  useEffect(() => {
    const fetchUserTokenBalance = async () => {
      setLoading(true);
      try {
        const connection = new Connection(
          "https://api.devnet.solana.com/"
        );
        const usdcMint = new PublicKey(
          "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        );
        if (wallet.publicKey) {
          const userTokenAccount = await getAssociatedTokenAddress(
            usdcMint,
            wallet.publicKey
          );
          const accountInfo = await getAccount(connection, userTokenAccount);
          const decimals = 6;
          const divisor = BigInt(10 ** decimals); // for 9 decimal places
          const balanceBigint = BigInt(accountInfo.amount); // your balance as a BigInt

          const beforeDecimal = balanceBigint / divisor; // divide by divisor and convert back to a number
          const afterDecimal = balanceBigint % divisor; // get the remainder (the part after the decimal point)

          // format as a string with two decimal places
          const balanceString = `${beforeDecimal}.${afterDecimal
            .toString()
            .padStart(decimals, "0")}`;
          const balance = parseFloat(balanceString).toFixed(2);
          setUserTokenBalance(balance);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "TokenAccountNotFoundError") {
            toast({
              title: "Account not found",
              description:
                "It looks like you do not have a SAMO token account yet. Please create one before proceeding.",
            });
          } else {
            toast({
              title: "Error fetching user balance",
              description:
                "There was an error fetching your SAMO balance. Please try again later.",
            });
          }
        }
      }
      setLoading(false);
    };

    // Only fetch the balance if wallet is connected and user is signed in.
    if (wallet.connected && isSignedIn) {
      fetchUserTokenBalance();
    }
  }, [wallet.connected, isSignedIn]);

  useEffect(() => {
    const fetchUserPrivateTokenBalance = async () => {
      setLoading(true);
      try {
        if (!elusivInstance || !wallet.connected || !isSignedIn) return;
        // Inside your fetchTransactions function
        let privateBalance = await elusivInstance.getLatestPrivateBalance(
          "USDC"
        );
        setUserPrivateTokenBalance(privateBalance.toString());
      } catch (error) {
        toast({
          title: "Error fetching user private balance",
          description:
            "Error fetching user private balance. Do top up your Elusiv Private Balance.",
        });
      }
      setLoading(false);
    };

    // Calling fetchUserPrivate here
    fetchUserPrivateTokenBalance();
  }, [elusivInstance, wallet.connected, isSignedIn, refreshKey]); // Added dependencies to useEffect

  useEffect(() => {
    const fetchPoolData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/2");
        const data = await response.json();
        if (response.ok) {
          const processedData = data.data.map(
            (item: { token: any; poolSize: any; poolValueInDollars: any }) => ({
              name: item.token,
              tokenSize: item.poolSize,
              usdSize: item.poolValueInDollars,
            })
          );

          setPoolData(processedData);

          // directly get the USDC pool
          const usdcPool = processedData.find(
            (pool: { name: string }) => pool.name === "USDC"
          );

          // set the USDC pool as the most liquid pool
          setMostLiquidPool(usdcPool);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch pool data:", error);
      }
      setLoading(false);
    };

    fetchPoolData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!elusivInstance) return;

      const last5PrivTxs = await elusivInstance.getPrivateTransactions(
        5,
        "USDC"
      );

      // Only keep the 'TOPUP' transactions
      const topUpTransactions = last5PrivTxs.filter(
        (tx) => tx.txType === "TOPUP"
      );

      if (topUpTransactions.length === 0) {
        setLoading(false);
        return;
      }

      // Find the most recent 'TOPUP' transaction
      const mostRecentTopUp = topUpTransactions.reduce((a, b) =>
        (a.sig?.blockTime || 0) > (b.sig?.blockTime || 0) ? a : b
      );
      // Convert the blockTime from Unix timestamp (seconds) to JavaScript Date (milliseconds)
      const lastTopUpDate = new Date(
        (mostRecentTopUp.sig?.blockTime || 0) * 1000
      );

      // Formatting the date in human-readable form
      const lastTopUpDateString =
        lastTopUpDate.toLocaleDateString() +
        " " +
        lastTopUpDate.toLocaleTimeString();

      // Get the current date and time
      const now = new Date();

      // Calculate the difference in hours
      const diffInMilliseconds = now.getTime() - lastTopUpDate.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      setLastTopUpInfo({
        date: lastTopUpDateString,
        elapsedTime: `${diffInHours.toFixed(2)} hours ago`, // Rounding off to 2 decimal places
      });
      setLoading(false);
    };

    fetchData();
  }, [elusivInstance, refreshKey]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!elusivInstance) return;

      const last5AllPrivTxs = await elusivInstance.getPrivateTransactions(
        5,
        "USDC"
      );
      console.log(last5AllPrivTxs);

      setTransactions(last5AllPrivTxs as PrivateTxWrapper[]);
      setLoading(false);
    };

    fetchData();
  }, [elusivInstance, refreshKey]);

  const handleTopUp = async () => {
    setLoading(true);
    toast({
      title: "TopUp Initiated!",
      description:
        "Please approve the transaction to TopUp your Elusiv Private Balance.",
    });
    if (!elusivInstance || !wallet.signTransaction) return;

    try {
      const connection = new Connection(
        "https://api.devnet.solana.com/"
      );

      // Convert amount from Sol to Lamports (1 Sol = 1e9 Lamports)
      const amountInDecimals = parseFloat(topupAmount) * 10 ** 6;
      const topupTx = await elusivInstance.buildTopUpTx(
        amountInDecimals,
        "USDC"
      );
      const signedTransaction = await wallet.signTransaction(topupTx.tx);

      signedTransaction.lastValidBlockHeight = (
        await connection.getLatestBlockhash()
      ).lastValidBlockHeight;
      topupTx.tx = signedTransaction;
      console.log("Signed Transaction:", signedTransaction);

      const res = await elusivInstance.sendElusivTxWithTracking(topupTx);
      await connection.confirmTransaction(
        {
          signature: res.elusivTxSig.signature,
          lastValidBlockHeight: topupTx.tx.lastValidBlockHeight!,
          blockhash: topupTx.tx.recentBlockhash!,
        },
        "confirmed"
      );
      toast({
        title: "Successful Top-Up",
        description: "User has sucessfully topped up Elusiv private balance.",
      });
    } catch (error) {
      console.log("Sign Message Error:", error);
      toast({
        title: "Top-Up Error",
        description:
          "There was an error topping-up your Elusiv Private Balance",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove parameters from the function declaration
  const handleSend = async () => {
    setSendStarted(true);
    setAccordionValue("");
    setLoading(true);
    toast({
      title: "Send Initiated!",
      description:
        "An Elusiv Private Send has been initiated. Please wait for your transaction to be processed.",
    });

    if (!elusivInstance) return;

    let intervalId: string | number | NodeJS.Timeout | undefined;
    try {
      const startTime = Date.now();
      const endTime = startTime + 60 * 1000; // estimated total time
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const total = endTime - startTime;
        const currentProgress = (elapsed / total) * 100;
        if (currentProgress < 100) {
          // Only update progress if it's less than 100
          setProgress(currentProgress);
        }
        if (currentTime >= endTime) {
          clearInterval(intervalId);
          // Do not set progress to 100 here
        }
      }, 100); // update progress every 100 ms

      setIsSendClicked(true);

      const inputPublicKey = new PublicKey(actualPublicKey); // convert provided publicKey to PublicKey object
      const amountInDecimals = parseFloat(sendAmount) * 10 ** 6; // convert amount from Sol to Lamports
      const memo = memoInput; // Assuming memoInput is a variable storing user's input
      const sendTx = await elusivInstance.buildSendTx(
        amountInDecimals,
        inputPublicKey,
        "USDC",
        undefined,
        memo
      );

      // use sendElusivTxWithTracking() to track the transaction progress
      const { commitmentInsertionPromise, elusivTxSig } =
        await elusivInstance.sendElusivTxWithTracking(sendTx);

      // wait for the commitment to be inserted
      const commitmentInserted = await commitmentInsertionPromise;
      if (commitmentInserted) {
        clearInterval(intervalId);
        setProgress(100); // Only set progress to 100 here
        console.log(`Send complete with sig ${elusivTxSig.signature}`);
        toast({
          title: "Send Complete!",
          description: "Send Complete!",
        });
      } else {
        throw new Error("Commitment insertion failed");
      }
      setIsSendClicked(false);
    } catch (error) {
      if (intervalId) clearInterval(intervalId);
      setProgress(0);
      console.error(error);
    } finally {
      setLoading(false);
      setAccordionValue("item-1");
    }
  };

  const handleSendMessage = async () => {
    setSendStarted(true);
    setLoading(true);
    toast({
      title: "Send Message Initiated!",
      description:
        "An Elusiv Private Send Message has been initiated. Please wait for your transaction to be processed.",
    });

    if (!elusivInstance) return;

    let intervalId: string | number | NodeJS.Timeout | undefined;
    try {
      const startTime = Date.now();
      const endTime = startTime + 75 * 1000; // estimated total time
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const total = endTime - startTime;
        setProgress((elapsed / total) * 100);
        if (currentTime >= endTime) {
          clearInterval(intervalId);
          setProgress(100);
        }
      }, 100); // update progress every 100 ms

      setIsSendClicked(true);

      const inputPublicKey = new PublicKey(actualPublicKey); // convert provided publicKey to PublicKey object

      const memo = memoInput; // Assuming memoInput is a variable storing user's input
      const sendTx = await elusivInstance.buildSendTx(
        50000,
        inputPublicKey,
        "USDC",
        undefined,
        memo
      );

      // use sendElusivTxWithTracking() to track the transaction progress
      const { commitmentInsertionPromise, elusivTxSig } =
        await elusivInstance.sendElusivTxWithTracking(sendTx);

      // wait for the commitment to be inserted
      const commitmentInserted = await commitmentInsertionPromise;
      if (commitmentInserted) {
        clearInterval(intervalId);
        setProgress(100);
        console.log(`Send complete with sig ${elusivTxSig.signature}`);
        toast({
          title: "Send Complete!",
          description: "Send Complete!",
        });
      } else {
        throw new Error("Commitment insertion failed");
      }
      setIsSendClicked(false);
    } catch (error) {
      if (intervalId) clearInterval(intervalId);
      setProgress(0);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAgain = async (
    actualPublicKey: string,
    sendAmount: string
  ) => {
    setLoading(true);
    toast({
      title: "Send Initiated!",
      description:
        "An Elusiv Private Send has been initiated. Please wait for your transaction to be processed.",
    });

    if (!elusivInstance) return;

    let intervalId: string | number | NodeJS.Timeout | undefined;
    try {
      const startTime = Date.now();
      const endTime = startTime + 130 * 1000; // estimated total time
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const total = endTime - startTime;
        setProgress((elapsed / total) * 100);
        if (currentTime >= endTime) {
          clearInterval(intervalId);
          setProgress(100);
        }
      }, 100); // update progress every 100 ms

      setIsSendClicked(true);

      const inputPublicKey = new PublicKey(actualPublicKey); // convert provided publicKey to PublicKey object
      const amountInDecimals = parseFloat(sendAmount) * 10 ** 6; // convert amount from Sol to Lamports
      const sendTx = await elusivInstance.buildSendTx(
        amountInDecimals,
        inputPublicKey,
        "USDC"
      );

      // use sendElusivTxWithTracking() to track the transaction progress
      const { commitmentInsertionPromise, elusivTxSig } =
        await elusivInstance.sendElusivTxWithTracking(sendTx);

      // wait for the commitment to be inserted
      const commitmentInserted = await commitmentInsertionPromise;
      if (commitmentInserted) {
        clearInterval(intervalId);
        setProgress(100);
        console.log(`Send complete with sig ${elusivTxSig.signature}`);
        toast({
          title: "Send Complete!",
          description: "Send Complete!",
        });
      } else {
        throw new Error("Commitment insertion failed");
      }
      setIsSendClicked(false);
    } catch (error) {
      if (intervalId) clearInterval(intervalId);
      setProgress(0);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isSolanaAddress = (address: string) => {
    const re =
      /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{44}$/;
    return re.test(address);
  };

  const checkWalletAddress = async (value: any) => {
    try {
      // Ensure that value is a string before processing.
      if (typeof value !== "string") {
        console.error(`Invalid value: ${value}`);
        setValidityStatus(false);
        return;
      }

      if (isSolanaAddress(value)) {
        console.log(value + " is a valid Solana address"); // Add console log here
        setValidityStatus(true);
        setActualPublicKey(value);
      } else {
        console.log(value + " is NOT a valid Solana address"); // And here

        // Rest of your code...
        const res = await fetch("/api/3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletName: value,
          }),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = await res.json();

        console.log(data); // Add this line to debug the response data

        if (data.data.walletAddress) {
          setValidityStatus(true);
          setActualPublicKey(data.data.walletAddress);
        } else {
          setValidityStatus(false);
          setActualPublicKey("");
        }
      }
    } catch (error) {
      console.error(error);
      setValidityStatus(false);
    }
  };

  useEffect(() => {
    checkWalletAddress(sendPublicKey);
  }, [sendPublicKey]);

  let typingTimeoutId: NodeJS.Timeout;

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setSendPublicKey(value);
    checkWalletAddress(value);

    // Clear the timeout if it's already been set.
    if (typingTimeoutId) clearTimeout(typingTimeoutId);

    // Set the new timeout
    typingTimeoutId = setTimeout(() => setUserStoppedTyping(true), 500); // 500ms delay
  };

  type PrivateTxWrapper = {
    amount: number;
    txType: string;
    recipient: { toBase58(): string };
    memo: string;
    sig: { blockTime: number };
  };

  interface TableDemoProps {
    transactions: PrivateTxWrapper[];
  }

  type DataItem = {
    token: "SAMO" | "USDC" | "USDT" | "LAMPORTS" | "BONK" | "mSOL";
    estimateLastTxs: number;
  };

  const fetchData = async () => {
    setLoading(true);
    const connection = new Connection(
      "https://api.devnet.solana.com/"
    );

    const tokenTypes: DataItem["token"][] = [
      "SAMO",
      "USDC",
      "USDT",
      "LAMPORTS",
      "BONK",
      "mSOL",
    ];
    const tempData: DataItem[] = [];

    for (const tokenType of tokenTypes) {
      const estimateLastTxs = await Elusiv.estimateTxsCountLastTime(
        "devnet",
        connection,
        3600,
        tokenType
      );
      tempData.push({ token: tokenType, estimateLastTxs });
    }

    setDataTxns([...tempData]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPublicKey = (key: string) => {
    if (!key) return "";
    return key.length > 6 ? `${key.substring(0, 3)}...${key.slice(-3)}` : key;
  };

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const emojis = ["😀", "😂", "😃", "😄", "😁", "😆", "😅", "😊", "😎"];

  return (
    <div>
      <Head>
        <title>Monstrè Privacy Dispenser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <MainNav />
            <div className="flex flex-1 items-center justify-end space-x-4">
              {(!wallet.connected || !isSignedIn) && <WalletMultiButton />}
              {wallet.connected && !isSignedIn && (
                <>
                  <Button className="mr-4" onClick={handleSignIn}>
                    Sign Message
                  </Button>
                </>
              )}
              {wallet.connected && isSignedIn && (
                <>
                  <WalletMultiButton />
                </>
              )}
            </div>
          </div>
        </header>
        <div>
          <div>
            {isSignedIn && (
              <>
                <div></div>
              </>
            )}
          </div>
          <Tabs defaultValue="overview">
            <div className="flex justify-center">
              <TabsList className="mt-8">
                <TabsTrigger value="overview">Dashboard</TabsTrigger>
                <TabsTrigger value="topup">Deposit</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="message">Message</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 px-8 py-8">
                <Card className="w-full md:col-span-4 overflow-auto">
                  <CardHeader>
                    <CardTitle>Elusiv Pool Data</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2 md:px-8 md:py-8 overflow-auto">
                    <Overview poolData={poolData} />
                  </CardContent>
                </Card>
                <Card className="w-full md:col-span-3">
                  <CardHeader>
                    <div className="mb-6">
                      <CardTitle className="mb-2">
                        Token Transactions In The Last Hour
                      </CardTitle>
                      <CardDescription>
                        Estimated Number of transactions that happened in the
                        last hour. The higher the number the better for privacy!
                      </CardDescription>
                    </div>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 mb-4"
                        >
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-4">
                        {dataTxns.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-row items-center justify-between pr-10"
                          >
                            <div className="flex items-center">
                              <Avatar>
                                <Image
                                  src={`/${item.token}.png`}
                                  alt={item.token}
                                  width={500} // adjust this
                                  height={500} // adjust this
                                />
                              </Avatar>
                              <CardTitle className="ml-4">
                                {item.token}
                              </CardTitle>
                            </div>
                            <div className="flex items-center">
                              <CardTitle className="text-green-600 text-xl">
                                {item.estimateLastTxs}
                              </CardTitle>
                              <CardTitle className="text-l ml-2">
                                Txns
                              </CardTitle>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="topup"
              className="px-8 mt-8 max-w-full lg:max-w-2xl mx-auto"
            >
              <Card className="px-2 py-2 mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Deposit</CardTitle>
                    <Button
                      className="flex items-center justify-center rounded-full h-8 w-8 p-1"
                      variant="secondary"
                      onClick={refreshBalance}
                      disabled={loading}
                    >
                      <motion.img
                        src="/reload.png"
                        alt="Refresh"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                        animate={controls} // assign the animation control
                      />
                    </Button>
                  </div>
                  <CardDescription>
                    Deposit Tokens into Your Elusiv Private Balance.
                  </CardDescription>
                  {wallet.connected &&
                    isSignedIn &&
                    userTokenBalance !== null && (
                      <CardDescription>
                        Your USDC balance in your wallet is:{" "}
                        {userTokenBalance.toString()}
                      </CardDescription>
                    )}
                  {loading ? (
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                      </div>
                    </div>
                  ) : (
                    wallet.connected &&
                    isSignedIn &&
                    userPrivateTokenBalance !== null && (
                      <CardDescription>
                        Your USDC private balance is:{" "}
                        {(Number(userPrivateTokenBalance) / 1e6).toFixed(2)}
                      </CardDescription>
                    )
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Token</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex flex-row-2">
                            <Image
                              src="/usdc2.png"
                              alt="usdc"
                              width={20}
                              height={20}
                            />
                            <span className="ml-2">USDC</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="topupAmount">Amount</Label>
                    <Input
                      id="topupAmount"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      placeholder="8 USDC"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleTopUp} disabled={loading}>
                    Deposit
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent
              value="send"
              className="px-8 mt-8 max-w-full lg:max-w-2xl mx-auto"
            >
              <Card className="px-2 py-2 mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Send</CardTitle>
                    <Button
                      className="flex items-center justify-center rounded-full h-8 w-8 p-1"
                      variant="secondary"
                      onClick={refreshBalance}
                      disabled={loading}
                    >
                      <motion.img
                        src="/reload.png"
                        alt="Refresh"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                        animate={controls} // assign the animation control
                      />
                    </Button>
                  </div>
                  <CardDescription>
                    Send privately to any public key on Solana.
                  </CardDescription>
                  {loading ? (
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                      </div>
                    </div>
                  ) : (
                    wallet.connected &&
                    isSignedIn &&
                    userPrivateTokenBalance !== null && (
                      <CardDescription>
                        Your USDC private balance is:{" "}
                        {(Number(userPrivateTokenBalance) / 1e6).toFixed(2)}
                      </CardDescription>
                    )
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <Accordion
                    type="single"
                    collapsible
                    value={accordionValue}
                    onValueChange={setAccordionValue}
                    className="w-full"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger>View Details</AccordionTrigger>
                      <AccordionContent>
                        <CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="name">Token</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue>
                                    <div className="flex flex-row-2">
                                      <Image
                                        src="/usdc2.png"
                                        alt="usdc"
                                        width={20}
                                        height={20}
                                      />
                                      <span className="ml-2">USDC</span>
                                    </div>
                                  </SelectValue>
                                </SelectTrigger>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="sendAmount"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                placeholder="8 USDC"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="address">Wallet Address</Label>
                              <div className="relative">
                                <Input
                                  id="sendPublicKey"
                                  value={sendPublicKey}
                                  onChange={handleChange}
                                  className="pr-6" // Make sure there's enough padding on the right
                                />
                                {validityStatus === true && (
                                  <CheckCircle2
                                    color="green"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                  />
                                )}
                                {validityStatus === false &&
                                  hasUserStoppedTyping && (
                                    <XCircle
                                      color="red"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    />
                                  )}
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="memo">Memo</Label>
                                <Input
                                  id="memo"
                                  value={memoInput}
                                  onChange={(e) => setMemoInput(e.target.value)}
                                  placeholder="Payment to Julian..."
                                />
                              </div>
                            </div>
                          </CardContent>
                        </CardHeader>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {sendStarted && (
                    <div>
                      <Card className="py-4 mt-4 border border-transparent">
                        <div className="flex items-center justify-center space-x-4 transition-all">
                          <div className="flex items-center space-x-1">
                            <Image
                              src="/elusiv-purple.svg"
                              alt="Elusiv Purple"
                              width={17}
                              height={17}
                              className="mt-0.5"
                            />
                            <h1 className="font-normal text-2xl">Elusiv</h1>
                          </div>

                          <Progress value={progress} />

                          <div>
                            <CardTitle className="font-normal text-2xl m-0 p-0">
                              {formatPublicKey(actualPublicKey)}
                            </CardTitle>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSend} disabled={loading}>
                    Private Send
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent
              value="message"
              className="px-8 mt-8 max-w-full lg:max-w-2xl mx-auto"
            >
              <Card className="px-2 py-2 mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Message</CardTitle>
                    <Button
                      className="flex items-center justify-center rounded-full h-8 w-8 p-1"
                      variant="secondary"
                      onClick={refreshBalance}
                      disabled={loading}
                    >
                      <motion.img
                        src="/reload.png"
                        alt="Refresh"
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                        animate={controls} // assign the animation control
                      />
                    </Button>
                  </div>
                  <CardDescription>
                    Send a Message privately to any Solana Wallet!
                  </CardDescription>
                  {loading ? (
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                      </div>
                    </div>
                  ) : (
                    wallet.connected &&
                    isSignedIn &&
                    userPrivateTokenBalance !== null && (
                      <CardDescription>
                        Your USDC private balance is:{" "}
                        {(Number(userPrivateTokenBalance) / 1e6).toFixed(2)}
                      </CardDescription>
                    )
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="address">Wallet Address</Label>
                    <div className="relative">
                      <Input
                        id="sendPublicKey"
                        value={sendPublicKey}
                        onChange={handleChange}
                        className="pr-6" // Make sure there's enough padding on the right
                      />
                      {validityStatus === true && (
                        <CheckCircle2
                          color="green"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        />
                      )}
                      {validityStatus === false && hasUserStoppedTyping && (
                        <XCircle
                          color="red"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        />
                      )}
                    </div>
                    <div className="space-y-2 relative">
                      {" "}
                      {/* Add relative here */}
                      <Label htmlFor="memo">Message</Label>
                      <Textarea
                        id="memo"
                        value={memoInput}
                        placeholder="Type your message here."
                        onChange={(e) => setMemoInput(e.target.value)}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-10 rounded-full p-0 absolute top-6 right-0 border-none" // add border-none here
                          >
                            <SmilePlus color="#708238" className="h-5 w-5" />
                            <span className="sr-only">Open popover</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="flex flex-wrap justify-around p-4">
                            {emojis.map((emoji, index) => (
                              <div
                                key={index}
                                className="text-2xl cursor-pointer"
                                onClick={() =>
                                  setMemoInput((prevMemo) => prevMemo + emoji)
                                }
                              >
                                {emoji}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    {sendStarted && (
                      <div>
                        <Card className="py-4 mt-4 border border-transparent">
                          <div className="flex items-center justify-center space-x-4 transition-all">
                            <div className="flex items-center space-x-1">
                              <Image
                                src="/elusiv-purple.svg"
                                alt="Elusiv Purple"
                                width={17}
                                height={17}
                                className="mt-0.5"
                              />
                              <h1 className="font-normal text-2xl">Elusiv</h1>
                            </div>

                            <Progress value={progress} />

                            <div>
                              <CardTitle className="font-normal text-2xl m-0 p-0">
                                {formatPublicKey(actualPublicKey)}
                              </CardTitle>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSendMessage} disabled={loading}>
                    Send Message
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="px-8 mt-8">
              <Card className="px-2 py-2 mb-8">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Recent Private Transactions</CardTitle>
                  </div>
                  <CardDescription>
                    View your previous private transactions and perform quick
                    actions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Table>
                    <TableCaption>Your Recent Transactions</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Transaction Type
                        </TableHead>
                        <TableHead className="text-center">Date/Time</TableHead>
                        <TableHead className="text-center">Recipient</TableHead>
                        <TableHead className="text-center">Memo</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">
                          Quick Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {transaction.txType === "SEND"
                              ? "Send"
                              : transaction.txType === "TOPUP"
                              ? "Deposit"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.sig?.blockTime
                              ? new Date(
                                  transaction.sig.blockTime * 1000
                                ).toLocaleString()
                              : "Not available"}
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.txType === "SEND" &&
                            transaction.recipient
                              ? transaction.recipient.toBase58()
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.memo
                              ? transaction.memo.slice(4)
                              : "No Memo"}
                          </TableCell>
                          <TableCell className="font-medium text-right">
                            {transaction.amount / 10 ** 6}
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.txType === "SEND" &&
                              transaction.recipient && (
                                <Button
                                  onClick={() =>
                                    handleSendAgain(
                                      transaction.recipient.toBase58(),
                                      (transaction.amount / 10 ** 6).toString()
                                    )
                                  }
                                >
                                  Send Again
                                </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-center">
            <Link href="https://elusiv.io/">
              <Image
                src="/elusiv2.png"
                alt="powered by Elusiv"
                width={210}
                height={210}
                className="footer-image"
              />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
