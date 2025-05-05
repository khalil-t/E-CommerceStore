import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUser = create(
  persist(
    (set, get) => ({
      // --- USER state ---
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      // --- PRODUCTS state ---
      productList: [],

      setProductList: (products) => {
        if (Array.isArray(products)) {
          set({ productList: products });
        } else {
          console.error('setProductList: Expected an array but got:', products);
        }
      },

      addProduct: (newProduct) => {
        let currentList = get().productList;
        if (!Array.isArray(currentList)) {
          console.warn("addProduct: productList is not an array. Resetting to []");
          currentList = [];
        }
        set({ productList: [...currentList, newProduct] });
      },

      UpdateProduct: (id) => {
        const currentList = get().productList || [];
        if (Array.isArray(currentList)) {
          const updatedList = currentList.filter((product) => product._id !== id);
          set({ productList: updatedList });
        } else {
          console.error('UpdateProduct: currentList is not an array:', currentList);
        }
      },

      toggleFeaturedInStore: (id, isFeatured) => {
        const currentList = get().productList || [];
        if (Array.isArray(currentList)) {
          const updatedList = currentList.map(product =>
            product._id === id ? { ...product, isFeatured } : product
          );
          set({ productList: updatedList });
        } else {
          console.error('toggleFeaturedInStore: currentList is not an array:', currentList);
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useUser;
