/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        secondary: "#1565C0",
        accent: "#FFB74D",
        background: "#F5F5F5",
        card: "#FFFFFF",
        textPrimary: "#212121",
        textSecondary: "#616161",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      fontSize: {
        hero: "40px",
        sectionTitle: "28px",
        cardTitle: "20px",
        body: "16px",
        small: "14px",
      },
      boxShadow: {
        card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
