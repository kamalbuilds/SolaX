import Form from "../../../components/form";
import LabeledTextField from "../../../components/form/input";
import Sidebar from "../../../components/sidebar";
import { z } from "zod";
import LabeledFileField from "../../../components/form/input-file";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/router";
const LoginValidation = z.object({
  product_name: z.string().min(1).max(255),
  price: z.number().positive(),
  category: z.string().min(1).max(255),
  picture_url: z.string().url({ message: "Upload Picture or try again" }),
});

const MarketplacePage = () => {
  const router = useRouter();
  console.log(supabase,"s")
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
                try {
                  const { error } = await supabase
                    .from("marketplace")
                    .insert(values);

                  if (!error) {
                    router.push("/marketplace");
                  }
                } catch (error) {
                  console.log(error);
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
