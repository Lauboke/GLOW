/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // You can add custom luxurious colors here later
        "glow-pink": "#d81b60",
      },
    },
  },
  plugins: [],
};
