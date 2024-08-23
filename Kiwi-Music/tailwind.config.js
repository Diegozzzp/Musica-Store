/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  "node_modules/flowbite/**/*.js"], 
  theme: {
    extend: {
      height: {
        '128': '32rem',
    },
    colors: {
      'kiwi': '#9DE0AD',
  },
  plugins: [ require('flowbite/plugin')],
}
}
}