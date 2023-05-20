/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--brand50)",
          100: "var(--brand100)",
          200: "var(--brand200)",
          300: "var(--brand300)",
          400: "var(--brand400)",
          500: "var(--brand-color)",
          600: "var(--brand600)",
          700: "var(--brand700)",
          800: "var(--brand-color-hover)",
          900: "var(--brand900)",
          // 50: "#FFF7ED",
          // 100: "#FFEDD5",
          // 200: "#FED7AA",
          // 300: "#FDBA74",
          // 400: "#FB923C",
          // 500: "#F97316",
          // 600: "#EA580C",
          // 700: "#C2410C",
          // 800: "#9A3412",
          // 900: "#7C2D12",
        },
      },
    }
  },
  plugins: []
};