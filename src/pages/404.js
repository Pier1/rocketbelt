import React, { useState, useEffect } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => {
  const [imageNum, setImageNum] = useState(Math.floor(Math.random() * 8));

  useEffect(() => {
    setImageNum(Math.floor(Math.random() * 8));
  });

  return (
    <Layout>
      <SEO title="404: Not found" />
      <h1>Page Not Found</h1>
      <video width="100%" autoPlay loop muted>
        <source src={`/images/404-${imageNum}.mp4`} type="video/mp4" />
      </video>
    </Layout>
  );
};

export default NotFoundPage;
