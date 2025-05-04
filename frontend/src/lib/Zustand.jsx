import { create } from 'zustand'
import { persist } from 'zustand/middleware';

const useUser =create(
    persist(
    (set)=>({
    user: null,

    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({ user: null }),

}),
{
    name: 'user-storage', 
  }

))
export default useUser;
