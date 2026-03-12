import { useInternetIdentity } from "./useInternetIdentity";

export function useAuthGate() {
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isAnonymous = !identity;

  return {
    isAuthenticated,
    isAnonymous,
    login,
    loginStatus,
    requireAuth: (callback: () => void) => {
      if (isAuthenticated) {
        callback();
      } else {
        login();
      }
    },
  };
}
