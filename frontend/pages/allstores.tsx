import { Container } from "../components/Container/index";
import { Input } from "../components/Input/index";
import { LoadingPage } from "../components/LoadingPage/index";
import { Header } from "../components/MediaObject/Header/index";
import { Spin } from "../components/Spin/index";
import { useProjects } from "../hooks/useProjects";
import { useProjectsSearch } from "../hooks/useProjectsSearch";
import Link from "next/link";
import { useState } from "react";

export const IndexView: React.FC = () => {
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

  return (
    <Container size="2xl" className="pt-8 space-y-8">
      <Header
        title={process.env.NEXT_PUBLIC_APP_NAME || "My Gallery"}
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
        <div className="grid grid-cols-3 gap-1">
          {data?.results.map((project) => (
            <Link
              key={project.id}
              href={`/${project.id}`}
              className="relative pb-[100%] rounded-md overflow-hidden hover:opacity-50"
            >
              <img
                className="absolute h-full w-full object-cover"
                src={project.image}
              />
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};
