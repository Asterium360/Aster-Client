/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        background: "#02060D",      
        "text-primary": "#ede6c7",   
        "text-secondary": "#5f5d7b", 
        "accent-primary": "#2f4992", 
        "accent-secondary": "#d2b84d", 
        "accent-additional": "#4f2859", 
      },
    },
  },
  plugins: [],
};
