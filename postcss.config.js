module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-svg': {
      dirs: './src/rocketbelt/components/icons',
      svgo: {
        plugins: [
          {
            removeDesc: true,
            removeTitle: true,
            cleanupAttrs: true,
          },
        ],
      },
    },
    autoprefixer: {},
    perfectionist: {},
  },
};
