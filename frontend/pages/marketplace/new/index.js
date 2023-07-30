import Form from "../../../components/form";
import LabeledTextField from "../../../components/form/input";
import Sidebar from "../../../components/sidebar";
import { z } from "zod";
import LabeledFileField from "../../../components/form/input-file";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/router";
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
  

  return (
    <div className="flex min-h-screen  ">
      <Sidebar />
      <main className="flex flex-1 flex-col">
        <div className="w-full">
          <div className="mx-auto max-w-xl">
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
                console.log(values.product_name, "values");
                const roomId = await createroom();

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
