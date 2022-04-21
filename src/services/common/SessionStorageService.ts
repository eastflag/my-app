import { Session } from './model/SessionStorage';
class SessionStorageService {
  public getIdToken = () => {
    return sessionStorage.getItem(Session.ID_TOKEN);
  };
  public setIdToken = (idToken: string): void => {
    this.setSessionStorageValue(Session.ID_TOKEN, idToken);
  };
  public deleteIdToken = (): void => {
    this.deleteSessionStorage();
  };
  private setSessionStorageValue = (key: string, value: string): void => {
    if (key) {
      sessionStorage.setItem(key, value);
    }
  };
  private deleteSessionStorage = (): void => {
    sessionStorage.clear();
  };
}

export const sessionStorageServiceInstance = new SessionStorageService();
