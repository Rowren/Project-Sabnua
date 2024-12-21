import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCategory } from "../api/Category";
import { listProduct } from '../api/product';

const useSabnuaStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      categories: [],
      products: [],

      // ฟังก์ชัน Login
      actionLogin: async (email, password) => {
        const res = await axios.post('http://localhost:5004/api/login', {
          email,
          password,
        });
        set({
          user: res.data.payload,
          token: res.data.token,
        });
        return res;
      },

      // ฟังก์ชัน Logout
      actionLogout: () => {
        set({ user: null, token: null });
      },

      // ฟังก์ชัน getCategory
      getCategory: async (token) => {
        try {
          const res = await listCategory(token);
          set({ categories: res.data });
        } catch (err) {
          console.error('Fetch Categories Failed:', err.message);
        }
      },

      // ฟังก์ชัน getProduct
      getProducts: async (token, count) => {
        try {
          const res = await listProduct(token, count);
          set({ products: res.data });
        } catch (err) {
          console.error('Fetch Products Failed:', err.message);
        }
      },
    }),
    {
      name: 'sabnuaStore', // ชื่อ key ใน LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSabnuaStore;
