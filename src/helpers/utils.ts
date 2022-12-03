export const getIpfsEndpoint = (path) => `https://infura-ipfs.io/${path}`;

export function sanitizeNftMetdataUrl(url: string): string {
  let finalUri = url;
  if (url?.startsWith("ipfs")) {
    const ipfsPath = url.split("ipfs://")[1];
    finalUri = getIpfsEndpoint(ipfsPath);
  }
  return finalUri;
}
