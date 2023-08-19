// @ts-nocheck
import Form from "../../components/form/index";
import LabeledTextField from "../../components/form/input";
import { z } from "zod";
import LabeledFileField from "../../components/form/input-file";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useMetaplex } from '../../context/Metaplex';
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';

import React, { ChangeEvent, useCallback} from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';

const LoginValidation = z.object({
  product_name: z.string().min(1).max(255),
  price: z.number().min(0).max(999.999), 
  // price: z.number().min(0).transform((val) => parseFloat(val.toFixed(3))), // Allow up to 3 decimal places
  category: z.string().min(1).max(255),
  picture_url: z.string().url({ message: "Upload Picture or try again" }),
  description: z.string().min(1).max(255),
});


const MarketplacePage = () => {
  const router = useRouter();
  const [image, setImage] = useState<File>()
  const [metadataURI, setMetadataURI] = useState(null);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const toast = useToast();
  const [productProperties, setProductProperties] = useState(null);

  const wallet = useWallet();


  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer fdgf'
    },
    body: JSON.stringify({
      attributes: {paymentslink: 'New Value'},
      upsert: false,
      name: productProperties?.name,
      symbol: 'symbol',
      description: productProperties?.description,
      image: productProperties?.image,
      receiverAddress: wallet.publicKey,
    })
  };
  
  fetch('https://dev.underdogprotocol.com/v2/projects/1/nfts', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

  const createroom = async () => {
    const url = 'https://api.huddle01.com/api/v1/create-iframe-room';
    const apiKey = process.env.NEXT_PUBLIC_HUDDLE_API_KEY;
    const body = JSON.stringify({
      title: 'Huddle01-Test',
      roomLocked: false
    });
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
  
      const data = await response.json();
      console.log(data.data.roomId, "response");
      return data.data.roomId;
    } catch (error) {
      console.log(error);
      // Handle the error appropriately
      throw error;
    }
  };
  
  const handleTokenAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTokenAmount(Number(event.target.value))
    },
    []
  )

  return (
    <div className="flex min-h-screen  ">

      <main className="flex flex-1 flex-col">
        <div className="w-full">
          <div className="mx-auto max-w-xl">
              <VStack spacing={4} p={3} align="stretch" mb={5}>
                    <Flex justifyContent="space-between">
                      <Heading size="lg">Tokenize your Product</Heading>
                    </Flex>
              </VStack>
            <p className="my-5 text-center text-2xl font-bold">
              Enter Product Information 
            </p>
            <Form
              submitText="Login"
              buttonClassName="!w-full mt-5"
              schema={LoginValidation}
              initialValues={{
                product_name: "",
                price: "",
                category: "",
                picture_url: "",
                description: "",
              }}
              onSubmit={async (values) => {
                console.log(values, "values");
                const roomId = await createroom();

                // Assuming you have the product details available after form submission
                let productProperties = {
                  name: values.product_name,
                  price: values.price,
                  category: values.category,
                  image: values.picture_url,
                  description: values.description,
                  roomId: roomId,
                  // Add more properties as needed for your NFT metadata
                };
                setProductProperties(productProperties);
                console.log(productProperties, "productProperties");

                // Call the function to upload metadata to Arweave and get the URI
                // const { uri , metadata} = await metaplex.nfts().uploadMetadata(productProperties);

                // console.log(uri, "uri",metadata,"metadata");
                // Store the metadataURI in state (you can also send it to Supabase)
                // setMetadataURI(uri);

                // Call the function to mint the NFT with the product properties
                // await handleCreateSFT(values,uri);

              }}
            >
              <LabeledTextField
                name="product_name"
                label="Product Name"
                placeholder="Product Name"
              />
              <LabeledTextField
                name="price"
                label="Price"
                placeholder="Price"
                type="number"
              />

              <LabeledTextField
                name="category"
                label="Category"
                placeholder="Category"
              />

              <LabeledTextField
                name="description"
                label="Description"
                placeholder="Write a brief description about your product"
              />

              <LabeledFileField
                name="picture_url"
                label="Picture Url"
                placeholder="Picture Url"
                type="file"
                accept="image/*"
              />

              <Box flexGrow={1} position="relative">
                <Flex
                  minH="20vh"
                  direction="column"
                  maxW="1600px"
                  marginX="auto"
                  flexGrow={1}
                  px={88}
                >

                  <Flex align="start" flexDirection="column">
                    <Heading size="md">Render your Product Image: </Heading>
                    <input
                      type="file"
                      onChange={(e) => e.target.files && setImage(e.target.files[0])}
                    />
                  </Flex>
                  {image && (
                    <Flex align="center" flexDirection="column">
                      <Box w="320px">
                        <Image
                          pos="relative"
                          _groupHover={{
                            zIndex: -1,
                            filter: 'none',
                          }}
                          src={URL.createObjectURL(image)}
                          objectFit="cover"
                          w="full"
                          h="360px"
                          filter="drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.2))"
                          borderRadius="xl"
                          alt="NFT"
                        />
                        <Input
                          placeholder="Enter token amount"
                          mt={5}
                          value={tokenAmount}
                          onChange={handleTokenAmountChange}
                        />
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;
