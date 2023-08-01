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
import { MetaplexProvider } from "../context/Metaplex";
import { AuctionHouseProvider } from "../context/AuctionHouse";
import Sidebar from "../components/sidebar";
import { ChakraProvider, theme } from "@chakra-ui/react";
import  SolPriceProvider  from "../context/SolPriceProvider.tsx";
import { useColorMode } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title>SOLAX</title>
      </Head>

      <AuthProvider>  
        <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <WalletConnectionProvider>
              <MetaplexProvider>
                <AuctionHouseProvider>
                  <SolPriceProvider>
                    <>
                      <div className="flex min-h-screen ">
                        <Sidebar />
                        <main className="flex flex-1 flex-col">
                          <Component {...pageProps} />
                        </main>
                      </div>
                    </>
                  </SolPriceProvider>
                </AuctionHouseProvider>
              </MetaplexProvider>
            </WalletConnectionProvider>
          </Hydrate>
        </QueryClientProvider>
        </ChakraProvider>
        </AuthProvider>
    </>
  );
}

export default MyApp;
