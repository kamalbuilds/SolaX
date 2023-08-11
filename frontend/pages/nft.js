import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import { useEffect , useState} from "react";

const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/SW3uzyu7hPsAhI5878T7jffYghoOuDLk";
const connection = new Connection(rpcUrl, "confirmed");
console.log("Connection to cluster established:", rpcUrl);

  
  const wallet = Keypair.generate();

const toMetaplexFile = (data, name) => {
  return {
    uri: name,
    type: 'image/jpeg',
    name,
    data,
  };
};

export default function MyComponent() {

    const [uril, setUril] = useState();

    const METAPLEX = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(
    bundlrStorage({
      address: "https://mainnet-beta.bundlr.network",
      providerUrl: rpcUrl,
      timeout: 60000,
    })
  );


const setUri = async () => {
  try {
    const response = await fetch("/api/uploadImage");
    const { imageBuffer } = await response.json();

    const file = toMetaplexFile(imageBuffer, "p2p.jpeg");

    const { uri, metadata } = await METAPLEX.nfts().uploadMetadata({
      name: "My First NFT",
      symbol: "First",
      description: "This is my first NFT",
      image: file,
    });

    setUril(uri);

    console.log(uri);
    console.log(metadata);
  } catch (error) {
    console.error("Error:", error);
  }
};

const testnft = async () => {
  try {
    // Make sure you have the 'uri' variable defined before calling this function.
    const { nft } = await METAPLEX.nfts().create({
      uri: "https://gateway.lighthouse.storage/ipfs/Qmbpz2x1bqGvBj1BtGrK8iynYkZi7tNshkZRjA8SCmp3PN",
      name: "My First NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    });

    console.log(nft);
  } catch (error) {
    console.error("Error:", error);
  }
};

testnft();

  useEffect(() => {
    setUri();
    // Call testnft() here if you have the 'uri' variable defined.
  }, []);

  // Your component's JSX and other code goes here.
  return <div>Your component content goes here.</div>;
}
