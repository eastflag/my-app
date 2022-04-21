import { action, computed, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { termServiceInstance } from '../../services/terms/TermService';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
export interface ServiceTerm {
  termId: number;
  termType: TermType;
  termVersion: string;
  termTitle: string;
  termContent: string;
}

export enum TermType {
  SERVICE = 'SERVICE',
  PRIVACY = 'PRIVACY',
}

class TermStore extends BaseStore {
  terms: ServiceTerm[] = [];

  selectedTermType?: TermType;
  selectedTermVersion: string = '';
  isDialogOpened: boolean = false;
  showTermsVersionList: boolean = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      terms: observable,

      selectedTermType: observable,
      selectedTermVersion: observable,
      isDialogOpened: observable,
      showTermsVersionList: observable,

      setTerms: action,

      setSelectedTermType: action,
      setSelectedTermVersion: action,
      setIsDialogOpened: action,
      setShowTermsVersionList: action,

      cleanUpDialogState: action,

      targetTerm: computed,
      termVersionList: computed,
      latestTermVersion: computed,
    });
  }

  get targetTerm() {
    return this.terms.find(
      (term) => term.termType === this.selectedTermType && term.termVersion === this.selectedTermVersion
    );
  }

  get termVersionList() {
    return this.terms.filter((term) => term.termType === this.selectedTermType).map((term) => term.termVersion);
  }

  get latestTermVersion() {
    if (this.termVersionList.length > 0) return this.termVersionList[0];
    else return '';
  }

  getLatestTermByType(termType: TermType) {
    return this.terms.find((term) => term.termType === termType);
  }

  setTerms(terms: ServiceTerm[]) {
    this.terms = terms;
  }

  setSelectedTermType(termType: TermType) {
    this.selectedTermType = termType;
  }

  setSelectedTermVersion(termVersion: string) {
    this.selectedTermVersion = termVersion;
  }

  setIsDialogOpened(isDialogOpened: boolean) {
    this.isDialogOpened = isDialogOpened;
  }

  setShowTermsVersionList(showTermsVersionList: boolean) {
    this.showTermsVersionList = showTermsVersionList;
  }

  openDialog(termType: TermType, showTermsVersionList: boolean) {
    this.setSelectedTermType(termType);
    this.setShowTermsVersionList(showTermsVersionList);
    this.setSelectedTermVersion(this.latestTermVersion);
    this.setIsDialogOpened(true);
  }

  cleanUpDialogState() {
    this.selectedTermType = undefined;
    this.showTermsVersionList = false;
    this.selectedTermVersion = '';
  }

  async fetchApi() {
    const result = await this.callApiWithState<BeApiResponse<ServiceTerm[]>>(termServiceInstance.fetchTerms);

    if (result?.successOrNot === 'Y' && result?.data) {
      this.setTerms(result.data);
    }
  }
}

export default TermStore;
