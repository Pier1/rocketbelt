const browserslist = [
  'Chrome >= 49',
  'Firefox >= 52',
  'Safari >= 10.1.2',
  'ie >= 11',
  'Edge >= 16',
  'iOS >= 9',
  'Android >= 5.1.1',
];

module.exports = {
  map: true,
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
    cssnano: {
      preset: [
        'default',
        {
          svgo: false,
          reduceIdents: false,
          autoprefixer: false,
          normalizeUrl: {
            stripWWW: false,
          },
        },
      ],
    },
  },
};
