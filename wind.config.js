import { withTypeScale } from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#111827',
          border: '#1f2937',
        }
      }
    }
  },
  plugins: [
    withTypeScale({
      // New v4.1 typography settings
      settings: {
        fontSizeMin: 14,
        fontSizeMax: 20,
      }
    })
  ],
}