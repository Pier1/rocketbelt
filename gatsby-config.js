module.exports = {
  siteMetadata: {
    title: 'Rocketbelt Pattern Library',
    description: 'Documentation of the Rocketbelt Pattern Library',
    author: 'Pier 1 Imports',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'rocketbelt',
        path: `${__dirname}/src/rocketbelt`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/layout.js'),
        },
        gatsbyRemarkPlugins: [
          'gatsby-remark-bracketed-spans',
          'gatsby-remark-smartypants',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-react-helmet',
    },
    {
      resolve: 'gatsby-transformer-sharp',
    },
    {
      resolve: 'gatsby-plugin-sharp',
    },
    {
      resolve: 'gatsby-plugin-offline',
    },

    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `Rocketbelt Pattern Library`,
    //     short_name: `Rocketbelt`,
    //     start_url: `/`,
    //     display: `minimal-ui`,
    //     icon: `site/images/icon.png`, // This path is relative to the root of the site.
    //   },
    // },
  ],
};
