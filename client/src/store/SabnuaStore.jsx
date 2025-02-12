import { create } from 'zustand';
import axios from 'axios';
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCategory } from "../api/Category";
import { listProduct, searchFilter } from '../api/product';
import { getAddress } from '../api/user';

const useSabnuaStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
      address: null,
      dashboardData: null,

      // ฟังก์ชันดึงข้อมูลจาก Dashboard
      getDashboardData: async () => {
        const token = get().token;
        if (!token) {
          console.error("Token ขาดหาย");
          return;
        }
        try {
          const data = await getDashboardData(token);
          set({ dashboardData: data });
        } catch (err) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Dashboard:", err.message);
        }
      },

      // ฟังก์ชัน Login
      actionLogin: async (email, password) => {
        try {
          const res = await axios.post('http://localhost:5004/api/login', { email, password });
          set({ user: res.data.payload, token: res.data.token });
          console.log('Login สำเร็จ ผู้ใช้:', res.data.payload);
          return res;
        } catch (err) {
          console.error('Login ล้มเหลว:', err.message);
          throw new Error('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง');
        }
      },

      // ฟังก์ชัน Logout
      actionLogout: () => {
        set({
          user: null,
          token: null,
          categories: [],
          products: [],
          carts: [],
          address: null,
          dashboardData: null,
        });
      },

      // ฟังก์ชันดึงที่อยู่ของผู้ใช้
      getUserAddress: async () => {
        const token = get().token;
        const user = get().user;

        if (!token || !user || !user.id) {
          console.error("Token หรือ userId ขาดหาย");
          return;
        }

        try {
          const addressData = await getAddress(token, user.id);
          if (addressData?.address) {
            set({ address: addressData.address });
          } else {
            console.error('ไม่พบที่อยู่ของผู้ใช้');
          }
        } catch (err) {
          console.error('เกิดข้อผิดพลาดในการดึงที่อยู่ของผู้ใช้:', err.message);
        }
      },

      // ฟังก์ชันดึง Categories
      getCategory: async () => {
        try {
          const res = await listCategory();
          set({ categories: res.data });
        } catch (err) {
          console.error('ไม่สามารถดึงหมวดหมู่ได้:', err.message);
        }
      },

      // ฟังก์ชันดึง Products
      getProducts: async (count) => {
        try {
          const res = await listProduct(count);
          set({ products: res.data });
        } catch (err) {
          console.error('ไม่สามารถดึงสินค้าได้:', err.message);
        }
      },

      // ฟังก์ชันค้นหาสินค้า
      actionSearchFilters: async ({ query, category, price }) => {
        try {
          console.log("กำลังค้นหาด้วยพารามิเตอร์:", { query, category, price });
          const res = await searchFilter({ query, category, price });
          set({ products: res.data });
        } catch (err) {
          console.error("เกิดข้อผิดพลาดในการค้นหา:", err.message);
        }
      },

      // ฟังก์ชันเพิ่มสินค้าลงในตะกร้า
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
          console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในตะกร้า:', err.message);
        }
      },

      // ฟังก์ชันอัปเดตจำนวนสินค้าที่อยู่ในตะกร้า
      actionUpdateQuantity: (productId, newQuantity) => {
        if (typeof newQuantity !== 'number' || isNaN(newQuantity) || newQuantity < 1) {
          console.error('จำนวนไม่ถูกต้อง:', newQuantity);
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

      // ฟังก์ชันลบสินค้าจากตะกร้า
      actionRemoveProduct: (productId) => {
        try {
          set((state) => ({
            carts: state.carts.filter((cart) => cart.id !== productId),
          }));
        } catch (err) {
          console.error('เกิดข้อผิดพลาดในการลบสินค้า:', err.message);
        }
      },

      // ฟังก์ชันคำนวณราคาสินค้าในตะกร้า
      getTotalPrice: () => {
        try {
          return get().carts.reduce((total, cart) => {
            const price = parseFloat(cart.price) || 0;
            const count = parseInt(cart.count) || 1;
            return total + price * count;
          }, 0);
        } catch (err) {
          console.error('เกิดข้อผิดพลาดในการคำนวณราคา:', err.message);
          return 0;
        }
      },

      // ฟังก์ชันเคลียร์สินค้าในตะกร้า
      clearCart: () => set({ carts: [] }),
    }),
    {
      name: 'sabnuaStore', // ชื่อที่ใช้เก็บข้อมูลใน localStorage
      storage: createJSONStorage(() => localStorage), // ใช้ localStorage ในการเก็บข้อมูล
      onRehydrateStorage: () => (state) => {
        console.log('ข้อมูลจาก store ได้ถูกดึงขึ้นมาแล้ว:', state);
      }
    }
  )
);

export default useSabnuaStore;
