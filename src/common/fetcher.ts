import { Fetcher } from "swr";

// Define the response data shape
interface ApiResponse {
  data: string[];
}

// Define the fetcher function with typed return value
const fetcher: Fetcher<ApiResponse> = async (url:string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default fetcher;
