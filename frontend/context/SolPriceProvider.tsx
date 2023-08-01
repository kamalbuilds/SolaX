import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from '@solana/web3.js';
import { PythConnection, PythCluster, getPythClusterApiUrl, getPythProgramKeyForCluster } from "@pythnetwork/client";
import SolPriceContext from "./SolPriceContext";

const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet';
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);
// This feed ID comes from this list: https://pyth.network/developers/price-feed-ids#solana-mainnet-beta
const feeds = [new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')];

// @ts-ignore
const SolPriceProvider: React.FC = ({ children }) => {
  const [solPrice, setSolPrice] = useState(0);

  useEffect(() => {
    const pythConnection = new PythConnection(connection, pythPublicKey, 'confirmed', feeds);

    pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
      const price = priceAccount.accountInfo.data;
      
      if (price.price && productAccount.accountInfo.data.product.symbol === 'Crypto.SOL/USD') {
        setSolPrice(price.price);
      }
    });

    pythConnection.start();
  }, []);

  return (
    <SolPriceContext.Provider value={{ price: solPrice }}>
      {children}
    </SolPriceContext.Provider>
  );
};

export default SolPriceProvider;
