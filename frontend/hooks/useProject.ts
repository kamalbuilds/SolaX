import {
    GetProjectRequest,
    GetProjectResponse,
  } from "@underdog-protocol/types";
  import axios, { AxiosError } from "axios";
  import { useQuery } from "react-query";
  
  export const useProject = (request: GetProjectRequest) => {
    return useQuery<GetProjectResponse, AxiosError>(
      ["project", request],
      async () => {
        const response = await axios.get(`/api/underdog/${process.env.NEXT_PUBLIC_NETWORK}/v2/projects/${request.params.projectId}`);
        return response.data;
      },
      { retry: false }
    );
  };
  