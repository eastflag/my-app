import { action, makeObservable, observable, runInAction } from 'mobx';
import { showToast } from '../../components/common/CommonToast';
import i18n from '../../i18n/i18n';
import { fileServiceInstance } from '../../services/common/FileService';
import { BucketType, FileActionType, PresignedUrlFiles } from '../../services/common/model/File';
import { launchpadDetailServiceInstance } from '../../services/launchpad/LaunchpadDetailService';
import {
  LaunchpadDetail,
  LaunchpadProjectStatus,
  MoreInfo,
  NftInfo,
  NftType,
} from '../../services/launchpad/model/launchpadModel';
import { getLocalDatetime } from '../../utils/FormatUtils';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

class LaunchpadDetailStore extends BaseStore {
  launchpadDetail: LaunchpadDetail | null = null;
  moreInfoList: MoreInfo[] | null = null;
  selectedMoreInfo: MoreInfo | null = null;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      launchpadDetail: observable,
      moreInfoList: observable,
      selectedMoreInfo: observable,

      setLaunchpadDetail: action,
      setMoreInfoList: action,
      setSelectedMoreInfo: action,
    });
  }

  setLaunchpadDetail(launchpadDetail: LaunchpadDetail) {
    this.launchpadDetail = launchpadDetail;
  }

  setMoreInfoList(moreInfoList: MoreInfo[]) {
    this.moreInfoList = moreInfoList;
  }

  setSelectedMoreInfo(moreInfo: MoreInfo) {
    this.selectedMoreInfo = moreInfo;
  }

  cleanUp() {
    runInAction(() => {
      this.launchpadDetail = null;
    });
  }

  getNftChipContent(nft: NftInfo) {
    let statusLabel = '';

    const status = this.launchpadDetail?.statusCode as LaunchpadProjectStatus;
    if (this.launchpadDetail?.nftType === NftType.GENERATIVE) {
      if (
        [
          LaunchpadProjectStatus.WhitelistSoon,
          LaunchpadProjectStatus.WhitelistOpen,
          LaunchpadProjectStatus.WhitelistClose,
          LaunchpadProjectStatus.ComingSoon,
        ].includes(status)
      ) {
        statusLabel = i18n.t('launchpad:detail.nft.liveAtDate', {
          date: getLocalDatetime(this.launchpadDetail.liveFromDatetime, 'toMinute'),
        });
      } else if (status === LaunchpadProjectStatus.Live) {
        statusLabel = i18n.t('launchpad:detail.nft.goToMint');
      } else {
        statusLabel = i18n.t('launchpad:detail.nft.detailedPage');
      }
    } else {
      if (
        [
          LaunchpadProjectStatus.WhitelistSoon,
          LaunchpadProjectStatus.WhitelistOpen,
          LaunchpadProjectStatus.WhitelistClose,
          LaunchpadProjectStatus.ComingSoon,
        ].includes(status) &&
        this.launchpadDetail?.liveFromDatetime
      ) {
        statusLabel = i18n.t('launchpad:detail.nft.liveAtDate', {
          date: getLocalDatetime(this.launchpadDetail.liveFromDatetime, 'toMinute'),
        });
      } else if (status === LaunchpadProjectStatus.Live && this.launchpadDetail?.nftType === NftType.EDITION) {
        statusLabel = `${nft.supplyCount.toLocaleString()}/${nft.supplyCount.toLocaleString()} Remaining`;
      }
    }

    return statusLabel;
  }

  async getPresignedUrl(fullPath: string) {
    const preSignedUrlRequest: PresignedUrlFiles = {
      presignedUrlFiles: [
        {
          additionExpireTime: 90000,
          bucketType: BucketType.PRIVATE,
          fileActionType: FileActionType.DOWNLOAD,
          fileName: fullPath.slice(fullPath.indexOf('.com/') + 5),
          preSignedUrl: '',
        },
      ],
    };

    const urlInfo = await fileServiceInstance.getPresignedInfo(preSignedUrlRequest);
    return urlInfo.data?.presignedUrlFiles[0].preSignedUrl || '';
  }

  async fetchLaunchpadDetail(launchpadId: number) {
    try {
      const result = await launchpadDetailServiceInstance.fetchLaunchpadDetail(launchpadId);

      if (result && result.successOrNot === 'Y') {
        if (result.data) {
          //TODO : public bucket으로 변경되면 로직 제거
          for await (const item of result.data.nfts) {
            item.mediaUrl = await this.getPresignedUrl(item.mediaUrl);
            item.thumbNailUrl = await this.getPresignedUrl(item.thumbNailUrl);
          }

          this.setLaunchpadDetail(result.data);
          this.initMoreInfoList(result.data);
          runInAction(() => {
            this.launchpadDetail?.nfts.forEach((v) => {
              v.statusLabel = this.getNftChipContent(v);
            });
          });
        }
      }
    } catch (error: unknown) {
      showToast(i18n.t('commonFail'));
    }
  }

  private initMoreInfoList(launchpadDetail: LaunchpadDetail) {
    const moreInfoTargetKeys = ['description', 'creatorIntro', 'roadMap', 'partners', 'team'];

    const moreInfoList: MoreInfo[] = [];
    Object.entries(launchpadDetail)
      .filter((entry) => moreInfoTargetKeys.includes(entry[0]))
      .sort((entryA, entryB) => moreInfoTargetKeys.indexOf(entryA[0]) - moreInfoTargetKeys.indexOf(entryB[0]))
      .forEach((entry) => {
        const moreInfo: MoreInfo = { label: entry[0], contents: entry[1] };
        moreInfoList.push(moreInfo);

        if (entry[0] === 'description') {
          this.setSelectedMoreInfo(moreInfo);
        }
      });

    this.setMoreInfoList(moreInfoList);
  }
}

export default LaunchpadDetailStore;
