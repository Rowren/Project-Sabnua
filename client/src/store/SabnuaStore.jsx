import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCategory } from "../api/Category";
import { listProduct } from '../api/product';
import { searchFilter } from '../api/product';
import _ from 'lodash';

const useSabnuaStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],

      // ฟังก์ชัน Login
      actionLogin: async (email, password) => {
        try {
          const res = await axios.post('http://localhost:5004/api/login', { email, password });
          set({ user: res.data.payload, token: res.data.token });
          console.log('Login successful. User:', res.data.payload);
          return res;
        } catch (err) {
          console.error('Login Failed:', err.message);
          throw new Error('Invalid login credentials');
        }
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

      //ฟังก์ชัน เพิ่มสินค้าลงในตระก้า
      actionAddtoCart: async (product) => {
        try {
          const carts = get().carts;
          const existingProduct = carts.find((cart) => cart.id === product.id);
      
          if (existingProduct) {
            set({
              carts: carts.map((cart) =>
                cart.id === product.id
                  ? { ...cart, count: cart.count + 1 }
                  : cart
              ),
            });
          } else {
            set({ carts: [...carts, { ...product, count: 1 }] });
          }
        } catch (err) {
          console.error(err.message);
        }
      },
            
      

      //ฟังก์ชัน อัปเดตจำนวน
      actionUpdateQuantity: (productId, newQuantity) => {
        if (typeof newQuantity !== 'number' || isNaN(newQuantity) || newQuantity < 1) {
          console.error('Invalid quantity:', newQuantity);
          return;
        }
      
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.id === productId
              ? { ...cart, count: newQuantity }
              : cart
          ),
        }));
      },
      
      

      //ฟังก์ชัน ลบสินค้าในตระก้า
      actionRemoveProduct: (productId) => {
        try {
          set((state) => ({
            carts: state.carts.filter((cart) =>
              cart.id !== productId
            ),
          }));
        } catch (err) {
          console.error('Remove Product Error:', err.message);
        }
      },

      //ฟังก์ชัน คำนวณราคา
      getTotalPrice: () => {
        try {
          return get().carts.reduce((total, cart) => {
            const price = parseFloat(cart.price) || 0;
            const count = parseInt(cart.count) || 1;
            return total + price * count;
          }, 0);
        } catch (err) {
          console.error('Get Total Price Error:', err.message);
          return 0; // คืนค่า 0 หากเกิดข้อผิดพลาด
        }
      },
      
      



    }),
    {
      name: 'sabnuaStore', // ชื่อของ store ที่เก็บใน localStorage
      storage: createJSONStorage(() => localStorage), // ใช้ localStorage สำหรับการจัดเก็บ
      onRehydrateStorage: () => (state) => { // ฟังก์ชัน callback เมื่อ rehydrate
        console.log('Store rehydrated:', state);
      }
    }
    
  )
);

export default useSabnuaStore;
