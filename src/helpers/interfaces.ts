export type NetworkType = typeof NETWORKS[keyof typeof NETWORKS];

export type NftApiType = "covalent" | "opensea";
export type NftStandardType = "erc721" | "erc1155";

export type NftDetails = {
  contractAddress: string;
  tokenID: string;
  options: {
    contractName: string;
    contractSymbol: string;
    contractImage: string;
    contractFallbackLogo: string;
    standard: string;
    contractDescription?: string; // covalent api doesn't provide contract description like opensea
    description: string;
    image: string;
    name: string;
    video: string;
    tokenBalance: string;
  };
};

export type NftHandlerParamsType = {
  network: string;
  userAddress: string;
  address: string;
  tokenId: string;
};

export interface NftMetadata {
  name: string;
  image?: string;
  description: string;
  image_url?: string;
  nft_standard?: NftStandardType;
  animation_url?: string;
  media?: {
    uri?: string;
  };
}

export interface CovalentNftItem {
  logo_url: string;
  contract_address: string;
  contract_ticker_symbol: string;
  contract_name: string;
  type: string;
  nft_data: {
    token_id: string;
    token_balance: string;
    external_data: {
      name?: string;
      description?: string;
      image?: string;
      animation_url?: string;
    };
    supports_erc: string[];
  }[];
}

export interface OpenseaNftItem {
  token_id: string;
  image_url: string;
  name: string;
  animation_url: string;
  description;
  asset_contract: {
    schema_name: string;
    address: string;
    name: string;
    symbol: string;
    image_url: string;
    total_supply: string;
    description: string;
  };
}
