import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      userInfo: null,

      setAccessToken: (token) => set({ accessToken: token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      clearAuth: () => set({ accessToken: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ accessToken: state.accessToken, userInfo: state.userInfo }),
    },
  ),
);

useAuthStore.subscribe((state) => {
  console.log('Auth State Changed:');
});

export default useAuthStore;
// const useAuthStore = create((set) => ({
//   accessToken: null,
//   userInfo: null,

//   setAccessToken: (token) => set({ accessToken: token }),
//   setUserInfo: (userInfo) => set({ userInfo }),
//   clearAuth: () => set({ accessToken: null, userInfo: null }),
// }));
