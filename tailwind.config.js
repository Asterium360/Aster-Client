/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", 
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [heroui()],
};
