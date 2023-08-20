// pages/store/[index]/[nft_add].tsx
import { useRouter } from 'next/router';

const ProductNft = () => {
  const router = useRouter();
  const { index, nft_add } = router.query;

  return (
    <div>
      <h1>Store {index} - Add NFT {nft_add}</h1>
      {/* Your content */}
    </div>
  );
};

export default ProductNft;
