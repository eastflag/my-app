import * as CommonToast from '../../components/common/CommonToast';
import { fileServiceInstance } from '../../services/common/FileService';
import { BucketType, FileActionType, PresignedUrlFiles } from '../../services/common/model/File';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { launchpadDetailServiceInstance } from '../../services/launchpad/LaunchpadDetailService';
import {
  BlockchainType,
  LaunchpadDetail,
  LaunchpadProjectStatus,
  NftInfo,
  NftSaleType,
  NftType,
} from '../../services/launchpad/model/launchpadModel';
import { getLocalDatetime } from '../../utils/FormatUtils';
import RootStore from '../Store';
import LaunchpadDetailStore from './LaunchpadDetailStore';

const rootStore = new RootStore();
const launchpadDetailStore = new LaunchpadDetailStore(rootStore);

jest.mock('../../services/launchpad/LaunchpadDetailService');
const mockLaunchpadDetailServiceInstance = launchpadDetailServiceInstance as jest.Mocked<
  typeof launchpadDetailServiceInstance
>;
jest.mock('../../services/common/FileService');
const mockFileServiceInstance = fileServiceInstance as jest.Mocked<typeof fileServiceInstance>;
jest.mock('../../components/common/CommonToast');
const mockedCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;

describe('LaunchpadDetailStore', () => {
  let launchpadDetail: LaunchpadDetail;
  let launchpadDetailResponse: BeApiResponse<LaunchpadDetail>;
  let preSignedUrl: PresignedUrlFiles;
  let preSignedUrlResponse: BeApiResponse<PresignedUrlFiles>;

  describe('launchpad 조회', () => {
    beforeEach(() => {
      launchpadDetail = {
        launchpadId: 1,
        saleType: 'SALE',
        saleTypeName: 'Sale',
        chainType: 'ETHEREUM',
        chainTypeName: 'Ethereum',
        nftType: 'UNIQUE',
        nftTypeName: 'Unique',
        name: 'Naemo Seasons by Odio us season',
        description:
          "<span class='ql-size-large'>Title</span><br><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.</p><span class='ql-size-large'>Title</span><br><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p></p></br><img src='https://s3-alpha-sig.figma.com/img/3d4b/034a/c8147e6e33100a359dff9382f9d631a6?Expires=1650844800&Signature=fUD5AbbfO-ihWYdWufgmP~D1z~4ERyKuxL0YGrBIzVSL5wQnes2~-5CthvExzlF5MvMR2P3I~xQJS8~LCJFcEzQOnd3lqJi~xT83iBYizft32zuiL1sbXFcNwubkzIcZjCB~WSNAgoBtPZfVejzikIix51vPsYfOfjhVIJWzC4n5hnnt9XsUxKKqTsnTOo1tLDeinkoRD-uiWt1AnSMsuBLs3yNhZBdzgnSFJ2LgL9MDOyWwThroRJSaTxnaAeYx0HQAuGG-80OqhVgfd1GrveqMjlly-zV~7MDB6h5u3s5Nn6HZD4rMvJLvEPL3LnWOyIek6c~7ibmGzJ1ohKsAzw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA' /><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>",
        representImageUrl:
          'https://s3-alpha-sig.figma.com/img/6507/9cb6/61292e0edbe462e8e7b377fd48786259?Expires=1650844800&Signature=Io-ZE9trklJ9PFscNOCRDxa79ZzsFpJTFwEHvQARkjTDorC0gd~QImFTWo3Ta6IeKGQfkt-OJgYdJn8FIMNK8rpQUhs6rtfJg5qyX~9Afe09iPFnM6wY3CGCkRqCQVwXUvz42lnQh2TYm6w0mVZdKI1bsZNCUB8lv0~8OmRUhDRdZHNPyCuVtF4KAm31zEbh7aN2DfsuxdvZOJHlcRHzoYpsKCAMaZRHBNj03UU5Jw8FU67deFENnit-A781bR3bVywMc8E~L8PhGvJaUtqWIWPQjmJbzmHkjgJgM1Al1WIFtvoiqZYQmSKXqBrYDmr-ksbjcbzF20xohNqzYmu-kQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
        creatorIntro:
          "<span class='ql-size-large'>Title</span><br><p>description</p><span class='ql-size-large'>subTitle</span><br><p>subDescription</p><iframe class='ql-video' frameborder='0' allowfullscreen='true' src='https://www.youtube.com/embed/VrGj5pE88B4?showinfo=0'></iframe>",
        roadMap: 'roadMap',
        team: 'testteam',
        partners: 'partners test',
        websiteUrl: 'https://www.naver.com',
        discordUrl: 'https://www.discord.url',
        twitterUrl: 'https://www.twitter_url',
        mediumUrl: 'https://www.medium_url',
        telegramUrl: 'https://www.telegram_url',
        instagramUrl: 'https://instagram_url',
        privateYn: 'Y',
        whitelistYn: 'N',
        comingSoonDatetime: '2022-04-07T07:35:44Z',
        whitelistComingSoonDatetime: '2022-04-07T07:35:44Z',
        whitelistToDatetime: '2022-04-07T07:35:44Z',
        whitelistFromDatetime: '2022-04-07T07:35:44Z',
        liveToDatetime: '2022-04-07T07:35:44Z',
        liveFromDatetime: '2022-04-07T07:35:44Z',
        privateSnapshotDatetime: '2022-04-07T07:35:44Z',
        statusCode: 'Coming Soon',
        nfts: [
          {
            nftId: 13,
            startPrice: 3.12333,
            purchaseLimitQuantity: 1,
            supplyCount: 1,
            nftName: 'NFT NAME 13',
            thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
            mediaType: 'IMAGE',
            mediaUrl: 'media_url/file.jpg',
            featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
          },
          {
            nftId: 10,
            startPrice: 2.55455,
            purchaseLimitQuantity: 1,
            supplyCount: 1,
            nftName: 'NFT NAME 10',
            thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
            mediaType: 'IMAGE',
            mediaUrl: 'media_url/file.jpg',
            featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
          },
          {
            nftId: 11,
            startPrice: 7.559999,
            purchaseLimitQuantity: 1,
            supplyCount: 1,
            nftName: 'NFT NAME 11',
            thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
            mediaType: 'IMAGE',
            mediaUrl: 'media_url/file.jpg',
            featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
          },
          {
            nftId: 9,
            startPrice: 8.423,
            purchaseLimitQuantity: 1,
            supplyCount: 1,
            nftName: 'NFT NAME 9',
            thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
            mediaType: 'IMAGE',
            mediaUrl: 'media_url/file.jpg',
            featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
          },
          {
            nftId: 12,
            startPrice: 10.239,
            purchaseLimitQuantity: 1,
            supplyCount: 1,
            nftName: 'NFT NAME 12',
            thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
            mediaType: 'IMAGE',
            mediaUrl: 'media_url/file.jpg',
            featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
          },
        ],
      };
      launchpadDetailResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: launchpadDetail,
      };
      preSignedUrl = {
        presignedUrlFiles: [
          {
            additionExpireTime: 90000,
            bucketType: BucketType.PRIVATE,
            fileActionType: FileActionType.DOWNLOAD,
            fileName: 'test.com/abc/def/ghi'.slice('test.com/abc/def/ghi'.indexOf('.com/') + 5),
            preSignedUrl: '',
          },
        ],
      };
      preSignedUrlResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: preSignedUrl,
      };
    });
    it('fetchLaunchpadDetail()', async () => {
      // given
      mockLaunchpadDetailServiceInstance.fetchLaunchpadDetail.mockResolvedValue(launchpadDetailResponse);
      mockFileServiceInstance.getPresignedInfo.mockResolvedValue(preSignedUrlResponse);

      // when
      await launchpadDetailStore.fetchLaunchpadDetail(1);

      // then
      expect(launchpadDetailStore.launchpadDetail?.launchpadId).toBe(1);
    });
    it('fetchLaunchpadDetail() fail', async () => {
      // given
      mockLaunchpadDetailServiceInstance.fetchLaunchpadDetail.mockRejectedValue(new Error());
      mockFileServiceInstance.getPresignedInfo.mockResolvedValue(preSignedUrlResponse);

      // when
      await launchpadDetailStore.fetchLaunchpadDetail(1);

      // then
      expect(mockedCommonToast.showToast).toBeCalledTimes(1);
      mockedCommonToast.showToast.mockRestore();
    });
    it('fetchLaunchpadDetail cleanUp', () => {
      launchpadDetailStore.cleanUp();

      expect(launchpadDetailStore.launchpadDetail).toBeNull();
    });
  });

  describe('launchpad 상태 조회', () => {
    const launchpad: LaunchpadDetail = {
      launchpadId: 1,
      saleType: NftSaleType.SALE,
      saleTypeName: 'Sale',
      chainType: BlockchainType.ETHEREUM,
      chainTypeName: 'Ethereum',
      nftType: NftType.GENERATIVE,
      nftTypeName: 'Generative',
      name: 'Naemo Seasons by Odio us season',
      description:
        "<span class='ql-size-large'>Title</span><br><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting.</p><span class='ql-size-large'>Title</span><br><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p></p></br><img src='https://s3-alpha-sig.figma.com/img/3d4b/034a/c8147e6e33100a359dff9382f9d631a6?Expires=1650844800&Signature=fUD5AbbfO-ihWYdWufgmP~D1z~4ERyKuxL0YGrBIzVSL5wQnes2~-5CthvExzlF5MvMR2P3I~xQJS8~LCJFcEzQOnd3lqJi~xT83iBYizft32zuiL1sbXFcNwubkzIcZjCB~WSNAgoBtPZfVejzikIix51vPsYfOfjhVIJWzC4n5hnnt9XsUxKKqTsnTOo1tLDeinkoRD-uiWt1AnSMsuBLs3yNhZBdzgnSFJ2LgL9MDOyWwThroRJSaTxnaAeYx0HQAuGG-80OqhVgfd1GrveqMjlly-zV~7MDB6h5u3s5Nn6HZD4rMvJLvEPL3LnWOyIek6c~7ibmGzJ1ohKsAzw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA' /><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</p>",
      representImageUrl:
        'https://s3-alpha-sig.figma.com/img/6507/9cb6/61292e0edbe462e8e7b377fd48786259?Expires=1650844800&Signature=Io-ZE9trklJ9PFscNOCRDxa79ZzsFpJTFwEHvQARkjTDorC0gd~QImFTWo3Ta6IeKGQfkt-OJgYdJn8FIMNK8rpQUhs6rtfJg5qyX~9Afe09iPFnM6wY3CGCkRqCQVwXUvz42lnQh2TYm6w0mVZdKI1bsZNCUB8lv0~8OmRUhDRdZHNPyCuVtF4KAm31zEbh7aN2DfsuxdvZOJHlcRHzoYpsKCAMaZRHBNj03UU5Jw8FU67deFENnit-A781bR3bVywMc8E~L8PhGvJaUtqWIWPQjmJbzmHkjgJgM1Al1WIFtvoiqZYQmSKXqBrYDmr-ksbjcbzF20xohNqzYmu-kQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
      creatorIntro:
        "<span class='ql-size-large'>Title</span><br><p>description</p><span class='ql-size-large'>subTitle</span><br><p>subDescription</p><iframe class='ql-video' frameborder='0' allowfullscreen='true' src='https://www.youtube.com/embed/VrGj5pE88B4?showinfo=0'></iframe>",
      roadMap: 'roadMap',
      team: 'testteam',
      partners: 'partners test',
      websiteUrl: 'https://www.naver.com',
      discordUrl: 'https://www.discord.url',
      twitterUrl: 'https://www.twitter_url',
      mediumUrl: 'https://www.medium_url',
      telegramUrl: 'https://www.telegram_url',
      instagramUrl: 'https://instagram_url',
      privateYn: 'Y',
      whitelistYn: 'N',
      comingSoonDatetime: '2022-04-07T07:35:44Z',
      whitelistComingSoonDatetime: '2022-04-07T07:35:44Z',
      whitelistToDatetime: '2022-04-07T07:35:44Z',
      whitelistFromDatetime: '2022-04-07T07:35:44Z',
      liveToDatetime: '2022-04-07T07:35:44Z',
      liveFromDatetime: '2022-04-07T07:35:44Z',
      privateSnapshotDatetime: '2022-04-07T07:35:44Z',
      statusCode: LaunchpadProjectStatus.ComingSoon,
      nfts: [],
    };

    it('generative sale before Coming Soon', () => {
      const nft: NftInfo = {
        nftId: 13,
        startPrice: 3.12333,
        purchaseLimitQuantity: 1,
        supplyCount: 1,
        nftName: 'NFT NAME 13',
        thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
        mediaType: 'IMAGE',
        mediaUrl: 'media_url/file.jpg',
        featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
      };

      launchpadDetailStore.setLaunchpadDetail(launchpad);

      const result = launchpadDetailStore.getNftChipContent(nft);

      expect(result).toEqual(
        `Live at\n${getLocalDatetime(launchpadDetailStore.launchpadDetail?.liveFromDatetime || '', 'toMinute')} UTC`
      );
    });

    it('generative sale Live', () => {
      const nft: NftInfo = {
        nftId: 13,
        startPrice: 3.12333,
        purchaseLimitQuantity: 1,
        supplyCount: 1,
        nftName: 'NFT NAME 13',
        thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
        mediaType: 'IMAGE',
        mediaUrl: 'media_url/file.jpg',
        featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
      };

      const temp = { ...launchpad };

      temp.statusCode = LaunchpadProjectStatus.Live;

      launchpadDetailStore.setLaunchpadDetail(temp);

      const result = launchpadDetailStore.getNftChipContent(nft);

      expect(result).toEqual(`Go to Mint`);
    });

    it('unique or edition before coming soon', () => {
      const nft: NftInfo = {
        nftId: 13,
        startPrice: 3.12333,
        purchaseLimitQuantity: 1,
        supplyCount: 1,
        nftName: 'NFT NAME 13',
        thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
        mediaType: 'IMAGE',
        mediaUrl: 'media_url/file.jpg',
        featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
      };

      const temp = { ...launchpad };

      temp.nftType = NftType.EDITION;

      launchpadDetailStore.setLaunchpadDetail(temp);

      const result = launchpadDetailStore.getNftChipContent(nft);

      expect(result).toEqual(
        `Live at\n${getLocalDatetime(launchpadDetailStore.launchpadDetail?.liveFromDatetime || '', 'toMinute')} UTC`
      );
    });

    it('edition Live', () => {
      const nft: NftInfo = {
        nftId: 13,
        startPrice: 3.12333,
        purchaseLimitQuantity: 1,
        supplyCount: 1,
        nftName: 'NFT NAME 13',
        thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
        mediaType: 'IMAGE',
        mediaUrl: 'media_url/file.jpg',
        featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
      };

      const temp = { ...launchpad };

      temp.nftType = NftType.EDITION;
      temp.statusCode = LaunchpadProjectStatus.Live;

      launchpadDetailStore.setLaunchpadDetail(temp);

      const result = launchpadDetailStore.getNftChipContent(nft);

      expect(result).toEqual(`${nft.supplyCount.toLocaleString()}/${nft.supplyCount.toLocaleString()} Remaining`);
    });

    it('Unique Live', () => {
      const nft: NftInfo = {
        nftId: 13,
        startPrice: 3.12333,
        purchaseLimitQuantity: 1,
        supplyCount: 1,
        nftName: 'NFT NAME 13',
        thumbNailUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/launchpad/test/abcd.jpg',
        mediaType: 'IMAGE',
        mediaUrl: 'media_url/file.jpg',
        featuredImageUrl: 'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/feature',
      };

      const temp = { ...launchpad };

      temp.nftType = NftType.UNIQUE;
      temp.statusCode = LaunchpadProjectStatus.Live;

      launchpadDetailStore.setLaunchpadDetail(temp);

      const result = launchpadDetailStore.getNftChipContent(nft);

      expect(result).toEqual('');
    });
  });
});
