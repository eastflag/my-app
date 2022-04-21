export interface LaunchpadDetail {
  launchpadId: number;
  saleType: string;
  saleTypeName: string;
  chainType: string;
  chainTypeName: string;
  nftType: string;
  nftTypeName: string;
  name: string;
  description: string;
  representImageUrl: string;
  creatorIntro: string;
  roadMap: string;
  team: string;
  partners: string;
  websiteUrl: string;
  discordUrl: string;
  twitterUrl: string;
  mediumUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  privateYn: 'Y' | 'N';
  whitelistYn: 'Y' | 'N';
  comingSoonDatetime: string;
  whitelistComingSoonDatetime: string;
  whitelistToDatetime: string;
  whitelistFromDatetime: string;
  liveToDatetime: string;
  liveFromDatetime: string;
  privateSnapshotDatetime: string;
  statusCode: string;
  nfts: NftInfo[];
}

export interface NftInfo {
  nftId: number;
  startPrice: number;
  purchaseLimitQuantity: number;
  supplyCount: number;
  nftName: string;
  thumbNailUrl: string;
  mediaType: string;
  mediaUrl: string;
  featuredImageUrl: string;
  statusLabel?: string;
}

export enum BlockchainType {
  ETHEREUM = 'ETHEREUM',
  SOLANA = 'SOLANA',
}

export enum NftType {
  UNIQUE = 'UNIQUE',
  EDITION = 'EDITION',
  GENERATIVE = 'GENERATIVE',
}

export enum LaunchpadProjectStatus {
  WhitelistSoon = 'Whitelist Soon',
  WhitelistOpen = 'Whitelist Open',
  WhitelistClose = 'Whitelist Close',
  ComingSoon = 'Coming Soon',
  Live = 'Live',
  AirDropSoon = 'AirDrop Soon',
  Ended = 'Ended',
}

export enum NftSaleType {
  SALE = 'SALE',
  AUCTION = 'AUCTION',
  AIRDROP = 'AIR_DROP',
}

export interface MoreInfo {
  label: string;
  contents: string;
}
