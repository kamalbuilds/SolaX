import React from "react";

const SimpleSwap = () => {
  return (
    <div>
      <div className="flex min-h-screen ">
        <main className="flex flex-1 flex-col p-5">
          <div>
            <h1 className="heading ">
              Exchange any tokens to Solana 🪙 and pay using solanaPay
            </h1>

            <div className="m-20 flex justify-center">
              <div>
                <iframe
                  id="simpleswap-frame"
                  name="SimpleSwap Widget"
                  width="528px"
                  height="492px"
                  src="https://simpleswap.io/widget/3c8bcf66-8890-4fd6-bf7e-3b9ae89fd1d2"
                ></iframe>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleSwap;
