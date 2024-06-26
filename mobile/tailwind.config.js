const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'guide': {
          'teal': "#3BD9CA",
          'gray': "#303449"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addUtilities, theme, e }) {
      const spacing = theme('spacing');
      const ionPaddingUtilities = Object.keys(spacing).map((key) => ({
        [`.ion-p-${e(key)}`]: {
          '--padding-start': spacing[key],
          '--padding-top': spacing[key],
          '--padding-end': spacing[key],
          '--padding-bottom': spacing[key]
        },
        [`.ion-pl-${e(key)}`]: {
          '--padding-start': spacing[key],
        },
        [`.ion-pt-${e(key)}`]: {
          '--padding-top': spacing[key],
        },
        [`.ion-pr-${e(key)}`]: {
          '--padding-end': spacing[key],
        },
        [`.ion-pb-${e(key)}`]: {
          '--padding-bottom': spacing[key],
        },
        [`.ion-px-${e(key)}`]: {
          '--padding-start': spacing[key],
          '--padding-end': spacing[key],
        },
        [`.ion-py-${e(key)}`]: {
          '--padding-top': spacing[key],
          '--padding-bottom': spacing[key],
        }
      }));

      addUtilities(ionPaddingUtilities, ['responsive']);

      const colors = theme('colors');
      const ionBackgroundUtilities = Object.keys(colors).flatMap((color) => {
        const colorShades = colors[color];
        if(typeof colorShades === 'string') {
          return {
            [`.ion-bg-${e(color)}`]: {
              '--background': colorShades,
            }
          }
        } else {
          return Object.keys(colorShades).map((shade) => ({
            [`.ion-bg-${e(color)}-${e(shade)}`]: {
              '--background': colorShades[shade]
            }
          }));
        }
      })

      addUtilities(ionBackgroundUtilities, ['responsive']);
    })
  ],
}

