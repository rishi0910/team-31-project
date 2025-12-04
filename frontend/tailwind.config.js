/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',      // A vibrant, modern green
        secondary: '#FF9800',    // A complementary energetic orange
        accent: '#F5F5F5',        // A light, clean gray for backgrounds
        text: '#212121',          // A darker, more readable gray for text
        white: '#FFFFFF',         // Pure white for contrast
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'hero': "url('https://images.unsplash.com/photo-1593113598332-cd288d649414')", // More impactful hero image
        'about': "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')", // Appetizing food image
        'contact': "url('https://images.unsplash.com/photo-1528747045269-390a3382f634')", // Professional contact background
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}