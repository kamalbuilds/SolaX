import Head from "next/head";
import "../styles/globals.css";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider } from '../AuthContext';
import WalletConnectionProvider from "../context/WalletConnectionProvider";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>P2P SOL Marketplace</title>
      </Head>

      <AuthProvider>  

        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <WalletConnectionProvider>
              <Component {...pageProps} />
            </WalletConnectionProvider>
          </Hydrate>
        </QueryClientProvider>

        </AuthProvider>
    </>
  );
}

export default MyApp;
