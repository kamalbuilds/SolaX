import { useQuery } from "@tanstack/react-query";
import Card from "../../components/Card";
import Sidebar from "../../components/sidebar";
import { supabase } from "../../lib/supabaseClient";
import { useEffect } from "react";

const MarketplacePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      return await supabase.from("marketplace").select().throwOnError();
    },
  });

  useEffect(() => {
    const fetchdata = async () => {
      
    let { data: marketplace, error: marketerror } = await supabase
    .from('marketplace')
    .select('id')
      console.log(marketplace, "marketplace");
      const { data, error } = await supabase.from("marketplace").select();
      console.log(data, "data2");
      if (error) {
        console.log(error, "error");
      }
    }
    fetchdata();

    
  }, [])

  return (
    <div className="flex min-h-screen ">
      <Sidebar />

      <main className="flex flex-1 flex-col p-5">
        <p className="my-5 text-center text-2xl font-bold">
          Marketplace 
        </p>
        {!isLoading && (
          <div>
            <div className="grid grid-cols-4 gap-5">
              {data.data.map((item) => (
                <Card
                  onClick={() => {
                    // TODO : BUY ITEM
                  }}
                  key={item.id}
                  price={item.price}
                  productName={item.product_name}
                  url={item.picture_url}
                  category={item.category}
                  room_id={item.room_id}
                />
              ))}
            </div>

            {data.data.length === 0 && (
              <div className="w-full">
                <p className="text-center text-2xl font-bold">No Data</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;
