/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ตรวจสอบให้ครอบคลุมไฟล์
  theme: {
    extend: {
      fontFamily: {
        sans: ['Prompt', 'sans-serif'], // ใช้ Prompt เป็นฟอนต์หลัก
      },
    },
  },
  plugins: [],
};