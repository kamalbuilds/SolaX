import { Container } from "../components/Container/index";
import { Input } from "../components/Input2/index";
import { LoadingPage } from "../components/LoadingPage/index";
import { Header } from "../components/MediaObject/Header/index";
import { Spin } from "../components/Spin/index";
import { useProjects } from "../hooks/useProjects";
import { useProjectsSearch } from "../hooks/useProjectsSearch";
import Link from "next/link";
import { useState } from "react";

const Allstores = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useProjectsSearch({
    query: {
      page: 1,
      limit: 20,
      query: `name~"${searchTerm}" OR description~"${searchTerm}"`,
      sortBy: "id",
      order: "desc",
    },
  });

  console.log("<>>>>>>> Data", data);

  return (
    <Container size="2xl" className="pt-8 space-y-8">
      <Header
        title={process.env.NEXT_PUBLIC_APP_NAME}
        size="5xl"
      />

      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm((e.target as any).value as string)}
      />

      {!data || isLoading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mx-2">
          {data?.results.map((project) => (
            <Link
              key={project.id}
              href={`/store/${project.id}`}
              className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
            >
              <div
                className="rounded-xl shadow-xl	 border-gray-200 border 	cursor-pointer	p-3 flex flex-col ">
                <div className="border-b-2">
                  <img className="m-auto w-[200px] h-[200px] object-contain" src={project.image} alt={project.name} />
                </div>
                <div className="mt-4">
                  <div className="text-xs text-left text-slate-500	">Product Details</div>
                  <div className="mt-3">
                    <div className="text-2xl	">{project.name}</div>
                    <div className="text-xs">{project.description}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <div >Mint Address: </div>
                  <div>
                    {
                      project.mintAddress.substring(0, 10) + '....'
                    }
                  </div>
                </div>



                <div className="flex my-4 items-center">
                  <div className="mr-1">Status: </div>
                  <div
                    style={{
                      borderColor: project.status === 'confirmed' ? '#16a34a' : '#b91c1c',
                      backgroundColor: project.status === 'confirmed' ? '#16a34a' : '#b91c1c',

                    }}
                    className="border rounded-lg px-4 py-1 text-sm capitalize text-white ">{project.status}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Allstores;