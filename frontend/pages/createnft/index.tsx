// @ts-nocheck
import Form from "../../components/form/index";
import LabeledTextField from "../../components/form/input";
import { z } from "zod";
import LabeledFileField from "../../components/form/input-file";
import { useRouter } from "next/router";
import { useMetaplex } from '../../context/Metaplex';
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import React, { ChangeEvent, useCallback } from 'react'
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
  price: z.number(),
  // price: z.number().min(0).transform((val) => parseFloat(val.toFixed(3))), // Allow up to 3 decimal places
  category: z.string().min(1).max(255),
  picture_url: z.string().url({ message: "Upload Picture or try again" }),
  description: z.string().min(1).max(255),
  currency: z.string().min(1).max(255),
  projectid: z.string().min(1).max(255),
});


const MarketplacePage = () => {
  const router = useRouter();
  const [image, setImage] = useState<File>()
  const [metadataURI, setMetadataURI] = useState(null);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const toast = useToast();
  const [productProperties, setProductProperties] = useState(null);
  const [productID, setProductID] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const wallet = useWallet();

  /**Product Creation */
  const createProduct = async ({
    product_name,
    description,
    picture_url,
    priceId
  }) => {

    /**
     * Things needed for creating a product
     * 1.priceId* (array of string)
     * 2.name
     * 3.description
     * 4.images array
     * 5.maxSupply
     */

    const prices = [priceId];

    console.log("Input values for creating product", product_name, description, picture_url, prices);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer secret_d9e600ad67794673b4cfc2a57d0f76b0',
      },
      body: JSON.stringify({
        // meta: { category: productProperties?.category },
        name: product_name,
        description: description,
        images: [picture_url],
        prices: prices,
        // maxSupply: tokenAmount
      })
    };

    try {
      const res = await fetch('https://api.spherepay.co/v1/product', options);
      const response = await res.json();

      console.log('response of product fun', response);

      if (response.message === 'success') {
        const { product } = response.data;
        const productId = product.id;
        return productId;

      } else {
        return null;
      }

    } catch (error) {

    }
  }

  const setprice = async (amount: number) => {

    /**
     * Things required for price API
     * 1. type
     * 2. currency
     * 3. unitAmount (by the decimal value)
    */

    console.log("Product price >>>>>>", amount)

    console.log(process.env.NEXT_PUBLIC_SPHEREPAY_API_KEY, amount)
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_SPHEREPAY_API_KEY}`,
      },
      // `${productID}`
      body: JSON.stringify({
        //TODO: Change the values to get dynamic data
        currency: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
        unitAmountDecimal: `0.0001`,
        type: 'oneTime'
      })
    };

    try {
      const res = await fetch('https://api.spherepay.co/v1/price', options);
      const response = await res.json();
      console.log("response of Price fn", response)

      const { price } = response.data;
      const priceId = price.id;

      return priceId;
    } catch (error) {
      console.log("Error in fetching price", error);
    }

  }

  const generateWalletId = async () => {

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_SPHEREPAY_API_KEY}`,
      },
      body: JSON.stringify({
        address: wallet.publicKey,
        network: "sol",
      })
    };
    try {
      const res = await fetch('https://api.spherepay.co/v1/wallet/paymentLink', options);
      const response = await res.json();
      console.log("response of wallet fn", response)
      console.log('response', response);
      const { wallet } = response.data;
      const walletId = wallet.id;

      return walletId;

    } catch (error) {
      console.log("Error", error);
    }


  }

  const createpaymentlink = async ({
    priceId,
    walletId
  }) => {

    /**
     * Things needed for generating payment links
     * 1. priceId
     * 2. walletId
     */

    console.log('PriceId', priceId, walletId);


    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_SPHEREPAY_API_KEY}`
      },
      body: JSON.stringify({
        successUrl: 'https://solax.vercel.app/dashboard', // this shall remain constant
        lineItems: [
          {
            price: priceId,
            quantity: "1",
            quantityMutable: false
          }
        ],
        wallets: [{
          id: walletId,
          shareBps: 10000,
        }],
      })
    };

    try {

      const res = await fetch('https://api.spherepay.co/v1/paymentLink', options);
      const response = await res.json();

      console.log("response of payment fn", response)
      const { paymentLink } = response.data;
      const paymentid = paymentLink.id;

      console.log("Payment Id", paymentid);
      return paymentid;

    } catch (error) {
      console.log("Error in payment link", error);
    }

  }

  const handleCreateSFT = async (values: any) => {

    const {
      product_name,
      price,
      category,
      picture_url,
      description,
      roomId,
      projectid,
      currency
    } = values;


    //TODO: Destructure the values so that it can be passed onto others also
    console.log("price", price, product_name, description, picture_url);

    // Calling setPrice for setting the price of the product
    const priceId = await setprice(price);

    console.log("Price Id in handelCreat !!! <>>><>", priceId);

    //Creating the product with priceid
    const productId = await createProduct({
      product_name,
      description,
      picture_url,
      priceId
    })

    console.log("Product Id generated: ", productId);

    const walletId = await generateWalletId();

    console.log("Wallet ID", walletId);

    const paymentId = await createpaymentlink({
      priceId,
      walletId
    });


    console.log("Payment Id generated: ", paymentId);


    const paymentURL = `https://spherepay.co/pay/${paymentId}`;
    console.log("<<<<<URL Payment>>>>>>>", paymentURL);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_UNDERSCORE_API_KEY}`,
      },
      body: JSON.stringify({
        attributes: { paymentslink: paymentURL },
        upsert: false,
        name: values?.product_name,
        symbol: 'symbol',
        description: values?.description,
        image: values?.picture_url,
        receiverAddress: wallet.publicKey,
      })
    };

    fetch(`https://dev.underdogprotocol.com/v2/projects/${productId}/nfts`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

  }

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
                currency: "",
                projectid: ""
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
                  projectid: values.projectid,
                  currency: values.currency,
                  // Add more properties as needed for your NFT metadata
                };
                setProductProperties(productProperties);
                console.log(productProperties, "productProperties");

                await handleCreateSFT(values);
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
                name="projectid"
                label="Store ID"
                placeholder="1"
                type="number"
              />

              <LabeledTextField
                name="price"
                label="Price"
                placeholder="Price"
                type="number"
              />

              <LabeledTextField
                name="currency"
                label="Currency"
                placeholder="Write the Currency"
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
