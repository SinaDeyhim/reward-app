module.exports = {
  darkMode: 'class', // Enable dark mode with a class
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Include all files under src directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937', // Dark gray
        secondary: '#4b5563', // Medium dark gray
        background: '#111827', // Very dark gray
        text: '#d1d5db', // Light gray
        accent: '#3b82f6', // Blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
