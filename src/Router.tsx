import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import SamplePage from './pages/sample/SamplePage';
import MobxLocalState from './pages/sample/MobxLocalState';
import List from './pages/sample/List';
import Item from './pages/sample/Item';
import AccountForm from './pages/sample/Form';
import ComponentsRoute from './pages/sample/Components';
import Layout from './layout/Layout';
import LaunchpadPage from './pages/sample/LaunchpadPage';
import FeaturesPage from './pages/sample/FeaturesPage';
import I18n from './pages/sample/I18n';
import SignUpPage from './pages/member/SignUpPage';
import SignUpSnsPage from './pages/member/SignUpSnsPage';
import SignUpIntegratePage from './pages/member/SignUpIntegratePage';
import RecoveryPassword from './pages/member/RecoveryPasswordPage';
import LoginPage from './pages/member/LoginPage';
import Main from './pages/Main';
import MemberUnlockPage from './pages/member/MemberUnlockPage';
import CreatorRegistraionPage from './pages/creator/CreatorRegistrationPage';
import CreatorWelcomePage from './pages/creator/CreatorWelcomePage';
import UrlWithSearchParam from './pages/sample/UrlWithSearchParam';
import FormSelectorSample from './pages/sample/FormSelectorSample';
import LaunchpadDetailPage from './pages/launchpadDetail/LaunchpadDetailPage';

const PrivateWrapper = () => {
  const location = useLocation();
  const authorizedUser = location.pathname !== '/privateTest';
  return authorizedUser ? <Outlet /> : <Navigate replace to="/" />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateWrapper />}>
          <Route path="/" element={<Layout />}>
            <Route path="main" element={<Main />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="launchpad" element={<LaunchpadPage />} />
            <Route path="launchpads/detail/:launchpadId" element={<LaunchpadDetailPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="marketplace" element={<div>marketplace</div>} />
            <Route path="stats" element={<div>stats</div>} />
            <Route path="metaverse" element={<div>metaverse</div>} />
            <Route path="signUp" element={<SignUpPage />} />
            <Route path="signUp/sns" element={<SignUpSnsPage />} />
            <Route path="signUp/integrate" element={<SignUpIntegratePage />} />
            <Route path="creator">
              <Route path="welcome" element={<CreatorWelcomePage />} />
              <Route path="registration" element={<CreatorRegistraionPage />} />
            </Route>
          </Route>
          <Route path="/privateTest" element={<SamplePage />} /> {/* test for PrivateWrapper */}
          <Route path="/sample" element={<SamplePage />}>
            <Route path="list" element={<List />} />
            <Route path="list/:id" element={<Item />} />
            <Route path="form">
              <Route index element={<AccountForm />} />
              <Route path="selector" element={<FormSelectorSample />} />
            </Route>
            <Route path="i18n" element={<I18n />} />
            <Route path="urlWithSearchParam" element={<UrlWithSearchParam />} />
            <Route path="components/*" element={<ComponentsRoute />} />
          </Route>
          <Route path="/sample/mobxLocalState" element={<MobxLocalState />} />
          <Route path="/member" element={<Layout />}>
            <Route path="recoveryPassword" element={<RecoveryPassword />} />
            <Route path="unlock" element={<MemberUnlockPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
