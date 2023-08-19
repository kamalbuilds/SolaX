import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import type { NextPage } from 'next'
import { Box, Button, Flex, Input, Spinner } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [transferable, setTransferable] = useState(true);
  const [compressed, setCompressed] = useState(true);
  const [semifungible, setSemifungible] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer 929f875d381729.81d73cc860d74f90b043cb8e2810b387',
      },
      body: JSON.stringify({
        attributes: { paymentnewKey: 'New Value' },
        name: name,
        symbol: symbol,
        description: description,
        image: image,
        transferable: transferable,
        compressed: compressed,
        semifungible: semifungible,
        externalUrl: 'https://solax.vercel.app/',
      }),
    };

    try {
      const response = await fetch(
        'https://dev.underdogprotocol.com/v2/projects',
        options
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box flexGrow={1} position="relative">
      <Flex align="center" justify="center" height="100vh">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
          <Input
            type="text"
            placeholder="Store Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Project Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Store Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Store Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="mb-2"
          />
          <Button type="submit" colorScheme="teal">
            Create Store
          </Button>
        </form>
      </Flex>
    </Box>
  );
};

export default Home;
