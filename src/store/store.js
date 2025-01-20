/* Navbar와 BottomSheet 상태관리 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      //메모리(렘) 상태
      userLocation: null,
      setUserLocation: (location) => set({ userLocation: location }),
      moveToLocation: null,
      setMoveToLocation: (location) => set({ moveToLocation: location }),
      mapRect: null,
      setMapRect: (rect) => set({ mapRect: rect }),
      mapLevel: null,
      setMapLevel: (level) => set({ mapLevel: level }),
      showSheet: false,
      setShowSheet: (show) => set({ showSheet: show }),
      selectedPlaceName: '',
      setSelectedPlaceName: (name) => set({ selectedPlaceName: name }),

      selectedNavbar: 'home',
      setSelectedNavbar: (icon) => set({ selectedNavbar: icon }),
    }),
    // {
    //   name: 'app-storage',
    //   getStorage: () => localStorage,
    //   partialize: (state) => ({ showSheet: state.showSheet }),
    // },
  ),
);

// useStore.subscribe((state) => {
//   console.log('현재 Zustand moveToLocation:', state.moveToLocation);
//   console.log('mapRect:', state.mapRect);
// });

export default useStore;
