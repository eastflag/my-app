import { BeApiResponse } from '../../services/common/model/RestApi';
import { termServiceInstance } from '../../services/terms/TermService';
import RootStore from '../Store';
import { ServiceTerm, TermType } from '../terms/TermStore';

const rootStore = new RootStore();
jest.mock('../../services/terms/TermService');

describe('termStore', () => {
  const { termStore } = rootStore;
  const mockedTermsApi = termServiceInstance as jest.Mocked<typeof termServiceInstance>;

  describe('fetchApi', () => {
    it('fetch terms success', async () => {
      const response: BeApiResponse<ServiceTerm[]> = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: [
          {
            termId: 1,
            termType: TermType.PRIVACY,
            termVersion: '20220205',
            termTitle: '1_title',
            termContent: '1_content',
          },
          {
            termId: 2,
            termType: TermType.SERVICE,
            termVersion: '20220205',
            termTitle: '2_title',
            termContent: '2_content',
          },
          {
            termId: 3,
            termType: TermType.PRIVACY,
            termVersion: '20210205',
            termTitle: '3_title',
            termContent: '3_content',
          },
          {
            termId: 4,
            termType: TermType.SERVICE,
            termVersion: '20210205',
            termTitle: '4_title',
            termContent: '4_content',
          },
        ],
      };

      const expectedServiceTerms = [
        {
          termId: 2,
          termType: TermType.SERVICE,
          termVersion: '20220205',
          termTitle: '2_title',
          termContent: '2_content',
        },
        {
          termId: 4,
          termType: TermType.SERVICE,
          termVersion: '20210205',
          termTitle: '4_title',
          termContent: '4_content',
        },
      ];

      const expectedPrivacyTerms = [
        {
          termId: 1,
          termType: TermType.PRIVACY,
          termVersion: '20220205',
          termTitle: '1_title',
          termContent: '1_content',
        },
        {
          termId: 3,
          termType: TermType.PRIVACY,
          termVersion: '20210205',
          termTitle: '3_title',
          termContent: '3_content',
        },
      ];

      const expectedTargetTerm = {
        termId: 2,
        termType: TermType.SERVICE,
        termVersion: '20220205',
        termTitle: '2_title',
        termContent: '2_content',
      };

      mockedTermsApi.fetchTerms.mockResolvedValue(response);

      await termStore.fetchApi();
      expect(termStore.loading).toEqual(false);
      termStore.openDialog(TermType.SERVICE, false);

      expect(termStore.selectedTermType).toEqual(TermType.SERVICE);
      expect(termStore.showTermsVersionList).toEqual(false);
      expect(termStore.isDialogOpened).toEqual(true);

      expect(termStore.targetTerm).toEqual(expectedTargetTerm);
      expect(termStore.termVersionList).toEqual(['20220205', '20210205']);
      expect(termStore.latestTermVersion).toEqual('20220205');
      expect(termStore.getLatestTermByType(TermType.SERVICE)).toEqual(expectedTargetTerm);

      termStore.cleanUpDialogState();
      expect(termStore.selectedTermType).toEqual(undefined);
      expect(termStore.showTermsVersionList).toEqual(false);
      expect(termStore.selectedTermVersion).toEqual('');
    });

    it('fetch terms success with no data', async () => {
      const response: BeApiResponse<ServiceTerm[]> = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: [],
      };
      mockedTermsApi.fetchTerms.mockResolvedValue(response);

      await termStore.fetchApi();
      expect(termStore.loading).toEqual(false);
      expect(termStore.terms).toEqual([]);
      termStore.openDialog(TermType.PRIVACY, true);
      expect(termStore.latestTermVersion).toEqual('');
    });

    it('fetch terms fail', async () => {
      const response: BeApiResponse<ServiceTerm[]> = {
        successOrNot: 'N',
        statusCode: 'ERROR',
        data: [],
      };
      mockedTermsApi.fetchTerms.mockResolvedValue(response);

      await termStore.fetchApi();
      expect(termStore.loading).toEqual(false);
      expect(termStore.terms).toEqual([]);
      termStore.openDialog(TermType.PRIVACY, true);
      expect(termStore.latestTermVersion).toEqual('');
    });
  });
});
