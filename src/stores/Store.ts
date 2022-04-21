import AppBarStore from './common/AppBarStore';
import CommonCodesStore from './common/CommonCodesStore';
import CommonCodeStore from './common/CommonCodeStore';
import DimStore from './common/DimStore';
import SessionStore from './common/SessionStore';
import WalletStore from './common/WalletStore';
import { CreatorRegistrationStore } from './creator/CreatorRegistrationStore';
import LaunchpadDetailStore from './launchpad/LaunchpadDetailStore';
import LoginComposedStore from './member/LoginComposedStore';
import LoginStore from './member/LoginStore';
import LogoutStore from './member/LogoutStore';
import PasswordStore from './member/PasswordStore';
import { RecoveryPasswordComposedStore } from './member/RecoveryPasswordComposedStore';
import RecoveryPasswordStore from './member/RecoveryPasswordStore';
import { SignUpComposedStore } from './member/SignUpComposedStore';
import SignUpFormStore from './member/SignUpFormStore';
import VerificationStore from './member/VerificationStore';
import MenuListStore from './menu/MenuStore';
import AccountStore from './sample/AccountStore';
import PostItemStore from './sample/PostItemStore';
import PostListStore from './sample/PostListStore';
import UrlWithSearchParamStore from './sample/UrlWithSearchParamStore';
import TermStore from './terms/TermStore';

class RootStore {
  appBarStore: AppBarStore;
  walletStore: WalletStore;
  dimStore: DimStore;
  menuListStore: MenuListStore;
  postListStore: PostListStore;
  postItemStore: PostItemStore;
  urlWithSearchParamStore: UrlWithSearchParamStore;
  accountStore: AccountStore;
  termStore: TermStore;
  signUpComposedStore: SignUpComposedStore;
  signUpFormStore: SignUpFormStore;
  passwordStore: PasswordStore;
  verificationStore: VerificationStore;
  recoveryPasswordStore: RecoveryPasswordStore;
  recoveryPasswordComposedStore: RecoveryPasswordComposedStore;
  loginStore: LoginStore;
  creatorRegistrationStore: CreatorRegistrationStore;
  logoutStore: LogoutStore;
  sessionStore: SessionStore;
  loginComposedStore: LoginComposedStore;
  commonCodeStore: CommonCodeStore;
  launchpadDetailStore: LaunchpadDetailStore;
  commonCodesStore: CommonCodesStore;

  constructor() {
    this.sessionStore = new SessionStore(this);
    this.walletStore = new WalletStore(this);
    this.commonCodesStore = new CommonCodesStore(this);
    this.appBarStore = new AppBarStore(this);
    this.dimStore = new DimStore(this);
    this.menuListStore = new MenuListStore(this);
    this.postListStore = new PostListStore(this);
    this.postItemStore = new PostItemStore(this);
    this.urlWithSearchParamStore = new UrlWithSearchParamStore(this);
    this.accountStore = new AccountStore(this);
    this.termStore = new TermStore(this);
    this.passwordStore = new PasswordStore(this);
    this.signUpFormStore = new SignUpFormStore(this);
    this.signUpComposedStore = new SignUpComposedStore(this);
    this.verificationStore = new VerificationStore(this);
    this.recoveryPasswordStore = new RecoveryPasswordStore(this);
    this.recoveryPasswordComposedStore = new RecoveryPasswordComposedStore(this);
    this.loginStore = new LoginStore(this);
    this.creatorRegistrationStore = new CreatorRegistrationStore(this);
    this.logoutStore = new LogoutStore(this);
    this.loginComposedStore = new LoginComposedStore(this);
    this.logoutStore = new LogoutStore(this);
    this.commonCodeStore = new CommonCodeStore(this);
    this.launchpadDetailStore = new LaunchpadDetailStore(this);

    this.sessionStore.init();
    this.commonCodesStore.init();
    this.postListStore.init();
  }
}

export default RootStore;

// Class observable 사용 이유
// 1. store에서 다른 store사용하는 케이스를 위해 this를 생성시에 주입 필요
// 2. BaseStore 를 상속받아 개별 store를 작성하도록 필요 (loading 처리 등 공통값 처리/관리를 위함)

// https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d
