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

      // --- cartItems state ---
      cartItems: [],
      setCartItems: (items) => set({ cartItems: items }),

      updateCart: (productId, quantity) => {
        const updatedCart = get().cartItems.map(item =>
          item._id === productId ? { ...item, quantity } : item
        );
        set({ cartItems: updatedCart });
      },
      deleteCartItem: (productId) => {
        const updatedCart = get().cartItems.filter(item => item._id !== productId);
        set({ cartItems: updatedCart });
      },
      // --- Num state ---

      num: 0,
      setNum: (count) => set({ num: count }),
      increment: () => set((state) => ({ num: state.num + 1 })),
      decrement: () => set((state) => ({
        num: state.num > 0 ? state.num - 1 : 0
      })),
      resetNum: () => set({ num: 0 }),
         // --- Coupon Voucher Code ---
      voucherCode: "",
      setVoucherCode: (code) => set({ voucherCode: code }),
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
