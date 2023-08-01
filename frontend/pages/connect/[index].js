import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { iframeApi, HuddleIframe } from "@huddle01/iframe";
import Sidebar from "../../components/sidebar";

function Connect( ) {
  const [walletAddress, setWalletAddress] = useState("");

  const router = useRouter();
  console.log(router.query.index, "router.query")
  const roomId  = router.query.index;
  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/${roomId}`,
    height: "600px",
    width: "100%",
  };
  console.log(roomId, "roomId")


  return (

    <div>
      <div className="flex min-h-screen ">
        <main className="flex flex-1 flex-col p-5">

          <div className="App">
            <div className="container">
              <div>
                <h1 className="heading">Schedule a One to One Meeting before final Payment</h1>
                <br />

              </div>
                <HuddleIframe roomUrl={`https://iframe.huddle01.com/${roomId}`} className="w-full aspect-video" />

            </div>
          </div>
        </main>
      </div>
    </div>

  );
}

export default Connect;
