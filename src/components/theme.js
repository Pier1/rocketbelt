export const theme = {
  plain: {
    color: '#ffffff',
    backgroundColor: '#2d2b55',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: 'rgb(179, 98, 255)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(73, 70, 133)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'rgb(255, 98, 140)',
      },
    },
    {
      types: ['string'],
      style: {
        color: 'rgb(165, 255, 144)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        // ebc406
        color: 'rgb(235,196,6)',
      },
    },
    {
      types: ['attr-value'],
      style: {
        // a5ff90
        color: 'rgb(165,255,144)',
      },
    },
    {
      types: ['builtin', 'variable', 'tag'],
      style: {
        color: 'rgb(158, 255, 255)',
        display: 'inline', // Rocketbelt has a .tag component whose styles must be outspecified…
        padding: '0',
        background: 'none',
        letterSpacing: '0',
        fontWeight: 'unset',
        fontSize: 'unset',
        alignItems: 'unset',
        justifyContent: 'unset',
      },
    },
    {
      types: ['keyword', 'operator'],
      style: {
        color: 'rgb(255, 157, 0)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(142, 250, 0)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgb(241, 110, 107)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(250, 208, 0)',
      },
    },
  ],
};

// export const theme = {
//   plain: {
//     backgroundColor: '#fafafa',
//   },
//   styles: [
//     {
//       types: ['comment'],
//       style: {
//         color: 'rgb(160, 161, 167)',
//         fontStyle: 'italic',
//       },
//     },
//     {
//       types: ['keyword', 'selector', 'changed'],
//       style: {
//         color: 'rgb(166, 38, 164)',
//       },
//     },
//     {
//       types: ['operator', 'punctuation'],
//       style: {
//         color: 'rgb(56, 58, 66)',
//       },
//     },
//     {
//       types: ['constant', 'number', 'builtin', 'attr-name'],
//       style: {
//         color: 'rgb(152, 104, 1)',
//       },
//     },
//     {
//       types: ['char', 'symbol'],
//       style: {
//         color: 'rgb(1, 132, 188)',
//       },
//     },
//     {
//       types: ['variable', 'tag', 'deleted'],
//       style: {
//         color: 'rgb(228, 86, 73)',
//         display: 'inline', // Rocketbelt has a .tag component whose styles must be outspecified…
//         padding: '0',
//         background: 'none',
//         letterSpacing: '0',
//         fontWeight: 'unset',
//         fontSize: 'unset',
//         alignItems: 'unset',
//         justifyContent: 'unset',
//       },
//     },
//     {
//       types: ['string', 'inserted'],
//       style: {
//         color: 'rgb(80, 161, 79)',
//       },
//     },
//     {
//       types: ['function'],
//       style: {
//         color: 'rgb(64, 120, 242)',
//       },
//     },
//     {
//       types: ['class-name'],
//       style: {
//         color: 'rgb(193, 132, 1)',
//       },
//     },
//   ],
// };
