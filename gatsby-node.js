const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevMode = process.env.NODE_ENV !== 'production';

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { toTitleCase } = require('./src/utils/toTitleCase.js');

const getSlugParents = (slug) => {
  const slugParentString = slug.substring(1, slug.length);
  return slugParentString.split('/');
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'SitePage' && node.context && node.context.id) {
    createNodeField({
      name: 'Mdx___NODE',
      value: node.context && node.context.id ? node.context.id : null,
      node,
    });
  }

  if (node.internal.type === 'Mdx') {
    const slug = createFilePath({
      node,
      getNode,
      basePath: 'pages',
      trailingSlash: false,
    });
    const slugParentsArr = getSlugParents(slug);

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });

    createNodeField({
      node,
      name: 'navLevel1',
      value: toTitleCase(slugParentsArr[0]),
    });

    createNodeField({
      node,
      name: 'navLevel2',
      value: toTitleCase(slugParentsArr.length > 1 ? slugParentsArr[1] : ''),
    });

    createNodeField({
      node,
      name: 'navLevel3',
      value: toTitleCase(slugParentsArr.length > 2 ? slugParentsArr[2] : ''),
    });

    createNodeField({
      node,
      name: 'lastCommitTime',
      value: require('child_process')
        .execSync(`git log --pretty=format:%aI -- ${node.fileAbsolutePath}`)
        .toString(),
    });
  }
};

// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions;
//   const { data, errors } = await graphql(`
//     {
//       allMdx {
//         edges {
//           node {
//             id
//             fields {
//               slug
//             }
//           }
//         }
//       }
//     }
//   `);

//   if (errors) throw errors;
//   const defaultLayout = path.resolve(`./src/components/layout.js`);
//   data.allMdx.edges.forEach(({ node }) => {
//     createPage({
//       path: node.fields.slug,
//       component: defaultLayout,
//       context: { id: node.id },
//     });
//   });
// };

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(scss|sass)$/i,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      plugins.define({
        __DEVELOPMENT__: stage === 'develop' || stage === 'develop-html',
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'css/[name].css',
        hmr: process.env.NODE_ENV === 'development',
      }),
    ],
  });
};
