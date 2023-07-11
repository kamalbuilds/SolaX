import { Web3Storage } from "web3.storage";

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBFNjA3YWRhMmIzODgyRjE2ZDYxMzUyNzk1OTA5Njc5NDg3MDMyYzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzQ5MDA3NTczNTUsIm5hbWUiOiJzb2xvbmEifQ.ZsFLSzVd_Z4r2KnkmtubUCYarp2Y9suPs0LdWyfTDr4";
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  return cid;
}
