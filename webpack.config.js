// // const path = require('path');
// import 'sanitize.css';
// import 'sanitize.css/forms.css';
// import 'sanitize.css/typography.css';

// const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

// module.exports = {
//   mode: 'development',
//   entry: ['./src/rocketbelt/rocketbelt.scss'],
//   output: {
//     path: `${__dirname}/dist/css`,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.s?[ac]ss$/i,
//         use: [
//           // Creates `style` nodes from JS strings
//           'style-loader',
//           // Translates CSS into CommonJS
//           'css-loader',
//           // Compiles Sass to CSS
//           'sass-loader',
//         ],
//       },
//     ],
//   },
//   plugins: [new FixStyleOnlyEntriesPlugin()],
// };
