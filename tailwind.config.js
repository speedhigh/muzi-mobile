module.exports = {
  mode: 'jit',
  purge: [
    './index.html', 
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      b: '0 1px 0 0 #E6E6E6'
    },
    extend: {
      backgroundImage: {
        'salary-bg': "url('/src/assets/images/vip/user/banner.webp')",
        'login-bg': "url(/src/assets/images/login_bg.png)"
      }
    },
    colors: {
      black: '#333333',
      white: '#FFFFFF',
      gray: {
        100: '#F1F1F1',
        200: '#F7F7F7',
        300: '#E6E6E6', // 分割线
        400: '#CCCCCC', // 分割线2
        500: '#999999', // 次要颜色 500
        600: '#666666', // 次要颜色 600
        700: '#4a5568',
        800: '#2d3748',
        900: '#100503',
      },
      red: {
        300:'#FCA5A5',
        400: '#f23030',
        500: '#BF2626',
      },
      origin: {
        100: '#FFEDD5',
        200: '#E2C796',
        300: '#d2ac61',
        400: '#F46B3B',
        500: '#894f07'
      }
    }
  },
  variants: {
    extend: {
      borderColor: ['last']
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
