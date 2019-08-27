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
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/layout.js'),
        },
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
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
    'gatsby-plugin-offline',
  ],
};
