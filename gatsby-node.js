const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
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

  if (
    node.internal.type === 'SitePage' &&
    node.context &&
    node.context.frontmatter &&
    node.context.frontmatter.scriptTags
  ) {
    createNodeField({
      name: 'scriptTags',
      value: node.context.frontmatter.scriptTags,
      node,
    });
  }

  if (node.internal.type === 'SitePage' && node.context && node.context.id) {
    createNodeField({
      name: 'Mdx___NODE',
      value: node.context.id,
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
      name: 'lastAuthorTime',
      value: require('child_process')
        .execSync(
          `git log --pretty=format:%aI -- ${node.fileAbsolutePath} | head -1 | tr -d '\n'`
        )
        .toString(),
    });

    createNodeField({
      node,
      name: 'lastAuthor',
      value: require('child_process')
        .execSync(
          `git log --pretty=format:%aN -- ${node.fileAbsolutePath} | head -1 | tr -d '\n'`
        )
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
//       context: { mdxId: node.id },
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
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /rocketbelt*.js/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    plugins: [
      new StylelintPlugin({
        lintDirtyModulesOnly: true,
        failOnWarning: false,
        failOnError: false,
        files: ['**/*.s?(a|c)ss', '**/*.jsx?', '!**/vendor/**/*'],
      }),
    ],
  });

  actions.setWebpackConfig({
    plugins: [
      new WriteFilePlugin({
        // Make sure HMR chunks aren't written to disk.
        // See https://github.com/gaearon/react-hot-loader/issues/456#issuecomment-273216602
        test: /^(?!.*(commons\.js|hot|rocketbelt.icons)).*/,
      }),
      new CopyPlugin(
        [
          {
            from: `${__dirname}/src/rocketbelt/**/rocketbelt*.js`,
            to: `${__dirname}/public/scripts/`,
            flatten: true,
            force: true,
          },
          {
            from: `${__dirname}/src/rocketbelt/**/rocketbelt.icons.svg`,
            to: `${__dirname}/public/icons/`,
            flatten: true,
            force: true,
          },
          {
            from: `${__dirname}/src/images/404/404*`,
            to: `${__dirname}/public/images/404`,
            flatten: true,
            force: true,
          },
        ]
        // { logLevel: 'debug' }
      ),
    ],
  });

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
