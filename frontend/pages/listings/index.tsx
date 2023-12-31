import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { isSft, token, Listing } from '@metaplex-foundation/js'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
// @ts-ignore
import ArtworkCard from '../../components/ArtWorkCard';
import { useAuctionHouse } from '../../context/AuctionHouse'
import { useMetaplex } from '../../context/Metaplex'
import { createNonce } from '../../components/nonce/createnonce';
import { getNonce } from '../../components/nonce/getnonce';
import useListings from '../../hooks/useListings'
import { set } from 'date-fns'

const Listings: NextPage = () => {
  const wallet = useWallet()
  const toast = useToast()
  const router = useRouter()

  const { listings, loadListings, isPending: isPendingListings } = useListings()
  const { metaplex } = useMetaplex()
  const { auctionHouse, isPending } = useAuctionHouse()
  const [noncepublickey, setNoncePublicKey] = useState<string>()
  const [selectedListing, setSelectedListings] = useState<Listing>()
  const [tokenAmount, setTokenAmount] = useState<number>()
  const isSftSelected = isSft(selectedListing?.asset)

  const isLoading = isPendingListings || isPending
  console.log(selectedListing,"selectedListing")

  const createNonceAccount = async () => {
    const result = await createNonce();
    // result.nonceAccount contains the public key of the nonce account
    // result.txhash contains the transaction hash
    console.log(`Nonce account: ${result.nonceAccount}`);
    console.log(`Transaction hash: ${result.txhash}`);
    setNoncePublicKey(result.nonceAccount);
    return result.nonceAccount;
  };
  
  const getNonceFromAccount = async (nonceAccountPublicKey) => {
    const result = await getNonce(nonceAccountPublicKey);
    // result.nonce contains the nonce
    // result.authority contains the public key of the authority
    // result.feeCalculator contains the fee calculator
    console.log(`Nonce: ${result?.nonce}`);
    console.log(`Authority: ${result?.authority}`);
    console.log(`Fee calculator: ${JSON.stringify(result?.feeCalculator)}`);
  
    return result?.nonce;
  };

  
  const handleExecuteSale = useCallback(async () => {
    if (
      !selectedListing ||
      !auctionHouse ||
      !metaplex ||
      !wallet ||
      !wallet.publicKey
    ) {
      return
    }
    console.log('selectedListing', selectedListing, isSftSelected)
    if (isSftSelected) {
      if (!tokenAmount) return

      const { bid } = await metaplex.auctionHouse().bid({
        auctionHouse,
        mintAccount: selectedListing.asset.address,
        price: selectedListing.price,
        tokens: token(tokenAmount),
      })

      await metaplex.auctionHouse().executeSale({
        auctionHouse,
        listing: selectedListing,
        bid,
      })
    } else {
      await metaplex.auctionHouse().buy({
        auctionHouse,
        listing: selectedListing,
      })
    }

    toast({
      title: 'Sale was executed.',
      description: 'You should receive asset in your wallet.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    router.push('/dashboard')
  }, [
    isSftSelected,
    tokenAmount,
    wallet,
    router,
    metaplex,
    auctionHouse,
    selectedListing,
    toast,
  ])

  const handleSetTokenAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTokenAmount(Number(event.target.value))
    },
    []
  )

  useEffect(() => {
    loadListings()
  }, [loadListings]);

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
        <VStack spacing={4} p={3} align="stretch" mb={5}>
          <Flex justifyContent="space-between">
            <Heading size="lg">Select an asset to buy it</Heading>
          </Flex>
        </VStack>

        {isLoading && (
          <VStack spacing={4} p={3} align="stretch" mb={5}>
            <Flex justifyContent="center">
              <Spinner size="xl" />
            </Flex>
          </VStack>
        )}

        {!isLoading && selectedListing && (
          <Flex align="center" flexDirection="column">
            <Box w="320px">
              <ArtworkCard
                artwork={selectedListing.asset}
                listing={selectedListing}
                key={selectedListing.asset.address.toBase58()}
              />
              {isSftSelected && (
                <>
                  <Text
                    mt={4}
                    fontSize="xl"
                    fontWeight="bold"
                    textTransform="capitalize"
                    textAlign="start"
                    padding="2px 10px 10px 5px"
                    color="white"
                  >
                    {`Tokens supply: ${selectedListing.asset.mint.supply.basisPoints}`}
                  </Text>
                  <Input
                    placeholder="Enter amount of tokens to buy"
                    mt={5}
                    value={tokenAmount}
                    onChange={handleSetTokenAmount}
                  />
                </>
              )}
              <Button
                colorScheme="purple"
                size="lg"
                mt={5}
                w="100%"
                disabled={isSftSelected && !tokenAmount}
                onClick={handleExecuteSale}
              >
                Buy
              </Button>

              <Button
                colorScheme="blue"
                size="lg"
                mt={5}
                w="100%"
                disabled={isSftSelected && !tokenAmount}
                onClick={() => router.push(`/connect/${selectedListing?.asset.json.roomId}`)}
              >
                Connect with the Owner
              </Button>
            </Box>
          </Flex>
        )}

        {!isLoading && !selectedListing && (
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            {listings?.map((listing) => (
              <ArtworkCard
                artwork={listing.asset}
                listing={listing}
                key={listing.asset.address.toBase58()}
                onClick={() => setSelectedListings(listing)}
              />
            ))}
          </Grid>
        )}

        <Button onClick={createNonceAccount}>Create Nonce Account</Button>
        <Button onClick={()=> getNonceFromAccount(noncepublickey)}>Get Nonce</Button>
      </Flex>
    </Box>
  )
}

export default Listings
