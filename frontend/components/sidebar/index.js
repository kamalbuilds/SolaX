import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { useCashApp } from "../../hooks/cashapp";
import Action from "../header/Action";
import NavMenu from "../header/NavMenu";
import Profile from "../header/Profile";
import NewTransactionModal from "../transaction/NewTransactionModal";
import TransactionQRModal from "../transaction/TransactionQRModal";
import TokenModal from "../swapTokens/TokenModal";

const Sidebar = () => {
  const { connected, publicKey } = useWallet();
  const [transactionQRModalOpen, setTransactionQRModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState(false);

  const {
    avatar,
    userAddress,
    doTransaction,
    setNewTransactionModalOpen,
    newTransactionModalOpen,
  } = useCashApp();
  return (
    <div className="h-full min-h-screen">
      <header className="flex min-h-screen w-[250px] flex-col bg-[blue] p-12">
        <Profile
          setModalOpen={setTransactionQRModalOpen}
          avatar={avatar}
          userAddress={userAddress}
          setQrCode={setQrCode}
        />
        <TransactionQRModal
          modalOpen={transactionQRModalOpen}
          setModalOpen={setTransactionQRModalOpen}
          userAddress={userAddress}
          setQrCode={setQrCode}
          myKey={publicKey}
        />

        <NavMenu connected={connected} publicKey={publicKey} />

        <Action setModalOpen={setNewTransactionModalOpen} />
        <NewTransactionModal
          modalOpen={newTransactionModalOpen}
          setModalOpen={setNewTransactionModalOpen}
          addTransaction={doTransaction}
        />

        <TokenModal />
      </header>
    </div>
  );
};

export default Sidebar;
