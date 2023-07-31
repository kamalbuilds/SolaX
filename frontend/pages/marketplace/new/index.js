import Form from "../../../components/form";
import LabeledTextField from "../../../components/form/input";
import { z } from "zod";
import LabeledFileField from "../../../components/form/input-file";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useMetaplex } from "../../useMetaplex";
import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Metadata , sendAndConfirmTransaction } from '@metaplex-foundation/js';

const LoginValidation = z.object({
  product_name: z.string().min(1).max(255),
  price: z.number().min(0).max(999.999), 
  // price: z.number().min(0).transform((val) => parseFloat(val.toFixed(3))), // Allow up to 3 decimal places
  category: z.string().min(1).max(255),
  picture_url: z.string().url({ message: "Upload Picture or try again" }),
});


const MarketplacePage = () => {
  const router = useRouter();

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
  
  const { metaplex } = useMetaplex();
  const wallet = useWallet();
  console.log("loop show ",wallet);
  const mintNFT = async (productProperties) => {
    // Your Solana wallet and connection setup

  
    // Create metadata for the NFT with product properties
    const metadata = await Metadata.createMetaplexMetadata({
      ...productProperties,
      // Add any additional properties specific to your NFT metadata
    });
    
    console.log(metadata,"metadata");
    // Mint the NFT
    const mintTx = await metaplex.mint(metadata);
    
    
    // Wait for transaction confirmation
    await sendAndConfirmTransaction(connection, mintTx);
  };

  // ah

  const a = async () => {

    const auctionHouseSettings = await metaplex
      .auctionHouse()
      .create({
          sellerFeeBasisPoints: 500, // 5% fee
          authority: metaplex.identity(),
          requireSignOff: true,
          canChangeSalePrice: true,
          hasAuctioneer: true, // to enable auctioneer
      });
      console.log(auctionHouseSettings,"auctionHouseSettings");
  }

  const airdrop = async () => {
    const airdropTx = await metaplex.airdrop({
      to: metaplex.identity().publicKey,
      amount: 1,
    });
    await sendAndConfirmTransaction(connection, airdropTx);
  };
    //     .rpc()
  //     .airdrop(response.auctionHouse.feeAccountAddress, sol(1))

  return (
    <div className="flex min-h-screen  ">

      <main className="flex flex-1 flex-col">
        <div className="w-full">
          <div className="mx-auto max-w-xl">
            <button onClick={a}>Create Auction House</button>
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
                  description: "My description",
                  // Add more properties as needed for your NFT metadata
                };

                console.log(productProperties, "productProperties");

                // Call the function to upload metadata to Arweave and get the URI
                const { uri , metadata} = await metaplex.nfts().uploadMetadata(productProperties);

                console.log(uri, "uri",metadata,"metadata");
                // Store the metadataURI in state (you can also send it to Supabase)
                setMetadataURI(uri);

                // Call the function to mint the NFT with the product properties
                await mintNFT(values);

                try {
                  const { error } = await supabase
                    .from("marketplace")
                    .insert({price : values.price, product_name : values.product_name, category : values.category, picture_url : values.picture_url , room_id: roomId});

                  if (!error) {
                    router.push("/marketplace");
                  }
                } catch (error) {
                  console.log(error,"some error occured");
                  return {
                    [FORM_ERROR]:
                      errorMessage[error?.message] ??
                      errorMessage[errorCode.SERVER_INTERNAL_ERROR],
                  };
                }
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

              <LabeledFileField
                name="picture_url"
                label="Picture Url"
                placeholder="Picture Url"
                type="file"
                accept="image/*"
              />
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;
