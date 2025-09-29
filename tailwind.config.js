/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // 👈 detecta todos los archivos de React
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // 👈 HeroUI
    ],
    theme: {
        extend: {},
    },
    plugins: [heroui()],
};
