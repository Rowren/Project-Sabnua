import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCategory } from "../api/Category";
import { listProduct} from '../api/product';
import { searchFilter } from '../api/product';


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
      getCategory: async () => {
        try {
          const res = await listCategory();
          set({ categories: res.data });
        } catch (err) {
          console.error('Fetch Categories Failed:', err.message);
        }
      },

      // ฟังก์ชัน getProduct
      getProducts: async (count) => {
        try {
          const res = await listProduct(count);
          set({ products: res.data });
        } catch (err) {
          console.error('Fetch Products Failed:', err.message);
        }
      },

      // ฟังก์ชันค้นหาข้อมูลสินค้า
      actionSearchFilters: async ({ query, category, price }) => {
        try {
          console.log("Calling search API with:", { query, category, price });
          const res = await searchFilter({ query, category, price });
          console.log("Search result:", res.data);  // ตรวจสอบผลลัพธ์
          set({ products: res.data });  // อัพเดต state ใน store ด้วยผลลัพธ์การค้นหา
        } catch (err) {
          console.error("Search error:", err.message);
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
