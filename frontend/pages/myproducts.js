import Sidebar from "../components";
import { ShowNFTs } from "../components/ShowNFT";

const MarketplacePage = () => {
  

  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      <main className="flex flex-1 flex-col p-5">
        <p className="my-5 text-center text-2xl font-bold">
          My Products
        </p>
        <ShowNFTs />
      </main>
    </div>
  );
};

export default MarketplacePage;
