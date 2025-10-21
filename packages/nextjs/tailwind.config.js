/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // Indigo
          hover: "#4338ca",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // Sky
          hover: "#0284c7",
        },
        accent: {
          DEFAULT: "#8b5cf6", // Purple
          hover: "#7c3aed",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
