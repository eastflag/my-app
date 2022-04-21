import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import RootStore from '../Store';

const rootStore = new RootStore();

describe('SessionStore 테스트', () => {
  const { sessionStore } = rootStore;

  it('init() 테스트 - session정보 sessionStorage에 set', () => {
    const mockIdToken =
      'eyJraWQiOiI0Vk4xTDM5K0h4ZXQydjVwVzRwWlkzTE53MkV0dmYyS3J3c2FsTUpOQ3JFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4ZGE1MDhlZi0wOWI3LTRlZTQtYjkxMC05OWEyMzJlMzNiYjIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTJfN0RMQktYV3pYIiwiY29nbml0bzp1c2VybmFtZSI6IjhkYTUwOGVmLTA5YjctNGVlNC1iOTEwLTk5YTIzMmUzM2JiMiIsIm9yaWdpbl9qdGkiOiIwMDdhNDI5Ni00MDIyLTQ4MWUtYjUzOS03NGQ1NjA1ZjI5Y2MiLCJhdWQiOiIzYzIxZXA0cXZqbzJndmFhOGNybXJmb2toOSIsImV2ZW50X2lkIjoiZTc4NDdjY2ItYzQ1NC00Y2MzLWIwZGQtYzRjNzQwMDdjN2JmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NDg3MTU1NTYsIm5pY2tuYW1lIjoibmFlbW9fMSIsImV4cCI6MTY0ODcxOTE1NiwiaWF0IjoxNjQ4NzE1NTU2LCJqdGkiOiJmNjMwODJmZC1iMzIxLTQxOWQtOTFlYy02ZDRiMjdkZTI5OTQiLCJlbWFpbCI6InRlc3QwMDA4MDVpZEBnbWFpbC5jb20ifQ.SKh6u3gKJLprYa7ebhuezruHIgwnqvwMANGPOsExTcAWoSG94-O-3KtDekM-w0SSQM7-C_NhG8Kkpu0NR1Xv8ytlLsW_E4-_ewEdK0_fXuksvnfWtl9odZLIeDUuIFz2SUyuZjd21QYVB59mBuY4uRdya8M8ZD1myIWiPsCuBoDJ9FfhFodsuwOU6WuAsbkbqpOCc1r_B7peCpOeuu86pmEf4WorAspRy3bUJTbwQi16XnsS3uWMGVOWN0qaJMhK2V5ZWdUKc0Rdzw55NcB2ejMe-TUjR0h5a_FhKxsBUblhmU60vLNvxJwZujPEwq5DUlCTXpO10J1H2ti03Vhppw';
    sessionStorageServiceInstance.setIdToken(mockIdToken);
    sessionStore.init();

    expect(sessionStore.isLogged).toBe(true);
    expect(sessionStore.memberId).toEqual('8da508ef-09b7-4ee4-b910-99a232e33bb2');
    expect(sessionStore.memberEmailAddress).toEqual('test000805id@gmail.com');
    expect(sessionStore.nickname).toEqual('naemo_1'); // cognito nickname
  });

  it('cleanUp() 테스트 - session 정보 clearUp', () => {
    sessionStore.cleanUp();

    expect(sessionStore.isLogged).toEqual(false);
    expect(sessionStore.memberId).toEqual('');
    expect(sessionStore.memberEmailAddress).toEqual('');
    expect(sessionStore.nickname).toEqual('');
  });
});
