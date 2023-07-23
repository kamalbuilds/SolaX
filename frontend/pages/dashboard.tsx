import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import type { NextPage } from 'next'
import { Box, Button, Flex, Input, Spinner } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'

import { useAuctionHouse } from '../context/AuctionHouse'

import Link from 'next/link'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import styles from '../styles/Home.module.css'
import { useToast } from '@chakra-ui/react';

const Home: NextPage = () => {
  const [auctionHouseAddress, setAuctionHouse] = useState<PublicKey>()
  const wallet = useWallet();

  const {
    auctionHouse,
    loadUserAuctionHouse,
    loadAuctionHouse,
    handleCreateAuctionHouse,
    isPending,
  } = useAuctionHouse();
  const toast = useToast();
  console.log(auctionHouse,"auctionHouse")
  const isWalletLoaded = wallet.publicKey && !isPending
  const shouldShowCreateBtn = isWalletLoaded && !auctionHouse
  const isAuctionHouseLoaded = isWalletLoaded && auctionHouse

  const handleAuctionHouseChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      setAuctionHouse(new PublicKey(e.target.value));

      toast({
        title: "Auction House Address",
        description: auctionHouse?.address.toBase58() || "No Auction House Address",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    },
    []
  )

  return (
    <Box flexGrow={1} position="relative">
      <Flex
        minH="100vh"
        direction="column"
        maxW="1600px"
        marginX="auto"
        flexGrow={1}
        px={88}
      >
        {isAuctionHouseLoaded && (
          <div className={styles.main}>
            <Flex flexDirection="column">
              <h2>Marketplace Connected with Add {auctionHouse?.address.toBase58()}</h2>
              <Link href="/createListing">
                <Button colorScheme="purple" width="100%" size="lg">
                  Create Listing
                </Button>
              </Link>
              <Link href="/createnft">
                <Button colorScheme="purple" width="100%" size="lg">
                  Create NFT
                </Button>
              </Link>
              <Link href="/listings">
                <Button colorScheme="purple" width="100%" size="lg">
                  Show Listings
                </Button>
              </Link>
              <Link href="/myListings">
                <Button colorScheme="purple" width="100%" size="lg">
                  My Listings
                </Button>
              </Link>
            </Flex>
          </div>
        )}

        {!isAuctionHouseLoaded && wallet.connected && (
          <div className={styles.main}>
            {!wallet.publicKey && <WalletMultiButton />}
            <Flex flexDirection="column">
              <Input
                placeholder="Enter your Store address"
                mt={5}
                value={
                  auctionHouseAddress ? auctionHouseAddress.toBase58() : ''
                }
                onChange={handleAuctionHouseChange}
              />
              <Button
                colorScheme="purple"
                size="lg"
                onClick={() =>
                  loadAuctionHouse(auctionHouseAddress as PublicKey)
                }
                disabled={!auctionHouseAddress}
              >
                Connect your Store
              </Button>
              <Button
                colorScheme="purple"
                size="lg"
                onClick={loadUserAuctionHouse}
              >
                Connect to User Store
              </Button>

              {shouldShowCreateBtn && (
                <Button
                  colorScheme="purple"
                  size="lg"
                  width="100%"
                  onClick={handleCreateAuctionHouse}
                >
                  Create your Store
                </Button>
              )}
            </Flex>
            {isPending && <Spinner size="xl" />}
          </div>
        )}
      </Flex>
    </Box>
  )
}

export default Home
